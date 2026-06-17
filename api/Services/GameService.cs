using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using PartyQuiz.Api.Contracts;
using PartyQuiz.Api.Domain;
using PartyQuiz.Api.Hubs;
using PartyQuiz.Api.Infrastructure;

namespace PartyQuiz.Api.Services;

public sealed class GameService
{
    private const string RoomCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private const int RoomCodeLength = 4;
    private const string AnswerLetterAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const int CategoryChoicesPerRound = 3;
    private const int CategorySelectionSeconds = 10;
    private const int QuestionIntroSeconds = 5;
    private const int ResultDisplaySeconds = 10;

    private readonly IRoomStore _roomStore;
    private readonly IQuestionBank _questionBank;
    private readonly IHubContext<GameHub> _hubContext;
    private readonly ILogger<GameService> _logger;

    public GameService(
        IRoomStore roomStore,
        IQuestionBank questionBank,
        IHubContext<GameHub> hubContext,
        ILogger<GameService> logger)
    {
        _roomStore = roomStore;
        _questionBank = questionBank;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task<CreateRoomResponse> CreateRoomAsync(CreateRoomRequest request, CancellationToken cancellationToken)
    {
        var hostName = ValidatePlayerName(request.PlayerName);
        var hostPlayerId = CreatePlayerId();

        for (var attempt = 0; attempt < 20; attempt++)
        {
            var code = GenerateRoomCode();
            var host = new Player
            {
                Id = hostPlayerId,
                Name = hostName,
                Avatar = NormalizeOptionalText(request.Avatar),
                IsHost = true,
                IsReady = true,
                Score = 0,
                Rank = 1
            };

            var room = new Room
            {
                Code = code,
                HostPlayerId = hostPlayerId,
                Players = [host],
                Categories = _questionBank.Categories,
                Leaderboard = BuildLeaderboard([host], [])
            };

            var created = await _roomStore.TryCreateAsync(room, _roomStore.ActiveRoomTtl, cancellationToken);
            if (created)
            {
                return new CreateRoomResponse(room.Code, hostPlayerId, room.State);
            }
        }

        throw new GameException(
            StatusCodes.Status503ServiceUnavailable,
            "room_code_unavailable",
            "Nie udalo sie wygenerowac unikalnego kodu pokoju.");
    }

    public async Task<JoinRoomResponse> JoinRoomAsync(
        string code,
        JoinRoomRequest request,
        CancellationToken cancellationToken)
    {
        var playerName = ValidatePlayerName(request.PlayerName);
        var playerId = CreatePlayerId();
        var joinedPlayer = new Player
        {
            Id = playerId,
            Name = playerName,
            Avatar = NormalizeOptionalText(request.Avatar),
            IsHost = false,
            IsReady = false
        };

        var room = await _roomStore.UpdateAsync(
            NormalizeRoomCode(code),
            (current, _) =>
            {
                EnsureState(current, RoomState.Lobby);

                if (current.Players.Count >= current.Settings.MaxPlayers)
                {
                    throw new GameException(StatusCodes.Status409Conflict, "room_full", "Pokoj jest pelny.");
                }

                var players = current.Players.Append(joinedPlayer).ToList();

                return Task.FromResult(current with
                {
                    Players = players,
                    Leaderboard = BuildLeaderboard(players, current.Leaderboard)
                });
            },
            cancellationToken);

        await PublishRoomAsync(room.Code, GameEvents.PlayerJoined, room, cancellationToken);

        return new JoinRoomResponse(room.Code, playerId, room.State);
    }

    public async Task<Room> LeaveRoomAsync(
        string code,
        string playerId,
        CancellationToken cancellationToken)
    {
        var room = await _roomStore.UpdateAsync(
            NormalizeRoomCode(code),
            (current, _) =>
            {
                if (current.State is not RoomState.Lobby and not RoomState.Finished)
                {
                    throw new GameException(
                        StatusCodes.Status409Conflict,
                        "invalid_room_state",
                        $"Akcja niedozwolona w stanie {current.State}.");
                }

                var leavingPlayer = EnsurePlayer(current, playerId);
                var players = current.Players
                    .Where(player => !string.Equals(player.Id, playerId, StringComparison.OrdinalIgnoreCase))
                    .ToList();

                var hostPlayerId = current.HostPlayerId;
                if (players.Count == 0)
                {
                    hostPlayerId = string.Empty;
                }
                else if (leavingPlayer.IsHost ||
                    !players.Any(player => string.Equals(player.Id, current.HostPlayerId, StringComparison.OrdinalIgnoreCase)))
                {
                    hostPlayerId = players[0].Id;
                }

                players = ApplyHost(players, hostPlayerId, current.State == RoomState.Lobby);
                var leaderboard = BuildLeaderboard(players, current.Leaderboard);

                return Task.FromResult(current with
                {
                    HostPlayerId = hostPlayerId,
                    Players = players,
                    Leaderboard = leaderboard,
                    CategoryVotes = current.CategoryVotes
                        .Where(vote => !string.Equals(vote.Key, playerId, StringComparison.OrdinalIgnoreCase))
                        .ToDictionary(vote => vote.Key, vote => vote.Value, StringComparer.OrdinalIgnoreCase),
                    Answers = current.Answers
                        .Where(answer => !string.Equals(answer.Key, playerId, StringComparison.OrdinalIgnoreCase))
                        .ToDictionary(answer => answer.Key, answer => answer.Value, StringComparer.OrdinalIgnoreCase)
                });
            },
            cancellationToken);

        await PublishRoomAsync(room.Code, GameEvents.PlayerLeft, room, cancellationToken);

        return room;
    }

    public async Task<Room> ReturnToLobbyAsync(
        string code,
        ReturnToLobbyRequest request,
        CancellationToken cancellationToken)
    {
        var room = await _roomStore.UpdateAsync(
            NormalizeRoomCode(code),
            (current, _) =>
            {
                EnsureState(current, RoomState.Finished);
                EnsurePlayer(current, request.PlayerId);
                EnsureHost(current, request.PlayerId);

                var resetPlayers = current.Players
                    .Select(player =>
                    {
                        var isHost = string.Equals(
                            player.Id,
                            current.HostPlayerId,
                            StringComparison.OrdinalIgnoreCase);

                        return player with
                        {
                            IsHost = isHost,
                            IsReady = isHost,
                            Score = 0,
                            Rank = 1
                        };
                    })
                    .ToList();

                var leaderboard = BuildLeaderboard(resetPlayers, []);
                var rankByPlayer = leaderboard.ToDictionary(
                    entry => entry.PlayerId,
                    entry => entry.Rank,
                    StringComparer.OrdinalIgnoreCase);

                resetPlayers = resetPlayers
                    .Select(player => player with { Rank = rankByPlayer.GetValueOrDefault(player.Id, 1) })
                    .ToList();

                return Task.FromResult(current with
                {
                    State = RoomState.Lobby,
                    Categories = _questionBank.Categories,
                    CurrentRound = 0,
                    CurrentQuestionIndex = 0,
                    CurrentCategoryId = null,
                    CurrentQuestion = null,
                    LastQuestionResult = null,
                    Players = resetPlayers,
                    Leaderboard = leaderboard,
                    SelectedCategoryIds = [],
                    CategoryVotes = new Dictionary<string, string>(),
                    Answers = new Dictionary<string, SubmittedAnswer>(),
                    QuestionStartedAtUtc = null,
                    FinishedAtUtc = null
                });
            },
            cancellationToken);

        await PublishRoomAsync(room.Code, GameEvents.ReturnedToLobby, room, cancellationToken);

        return room;
    }

    public async Task<Room> UpdateSettingsAsync(
        string code,
        UpdateRoomSettingsRequest request,
        CancellationToken cancellationToken)
    {
        var room = await _roomStore.UpdateAsync(
            NormalizeRoomCode(code),
            (current, _) =>
            {
                EnsureHost(current, request.HostPlayerId);
                EnsureState(current, RoomState.Lobby);

                var settings = current.Settings with
                {
                    QuestionsPerRound = request.QuestionsPerRound ?? current.Settings.QuestionsPerRound,
                    RoundsCount = request.RoundsCount ?? current.Settings.RoundsCount,
                    AnswerTimeSeconds = request.AnswerTimeSeconds ?? current.Settings.AnswerTimeSeconds,
                    MaxPlayers = request.MaxPlayers ?? current.Settings.MaxPlayers
                };

                ValidateSettings(settings, current.Players.Count);

                return Task.FromResult(current with { Settings = settings });
            },
            cancellationToken);

        await PublishRoomAsync(room.Code, GameEvents.RoomSettingsChanged, room, cancellationToken);

        return room;
    }

    public async Task<Room> SetReadyAsync(
        string code,
        string playerId,
        SetPlayerReadyRequest request,
        CancellationToken cancellationToken)
    {
        var room = await _roomStore.UpdateAsync(
            NormalizeRoomCode(code),
            (current, _) =>
            {
                EnsureState(current, RoomState.Lobby);
                EnsurePlayer(current, playerId);

                var players = current.Players
                    .Select(player => player.Id == playerId ? player with { IsReady = request.IsReady } : player)
                    .ToList();

                return Task.FromResult(current with { Players = players });
            },
            cancellationToken);

        await PublishRoomAsync(room.Code, GameEvents.PlayerReadyChanged, room, cancellationToken);

        return room;
    }

    public async Task<Room> StartGameAsync(
        string code,
        StartGameRequest request,
        CancellationToken cancellationToken)
    {
        var room = await _roomStore.UpdateAsync(
            NormalizeRoomCode(code),
            (current, _) =>
            {
                EnsureHost(current, request.HostPlayerId);
                EnsureState(current, RoomState.Lobby);
                ValidateSettings(current.Settings, current.Players.Count);

                if (current.Players.Count == 0)
                {
                    throw new GameException(
                        StatusCodes.Status409Conflict,
                        "room_has_no_players",
                        "Pokoj nie ma graczy.");
                }

                var notReadyPlayers = current.Players
                    .Where(player => !player.IsHost && !player.IsReady)
                    .Select(player => player.Name)
                    .ToList();
                if (notReadyPlayers.Count > 0)
                {
                    throw new GameException(
                        StatusCodes.Status409Conflict,
                        "players_not_ready",
                        "Nie wszyscy gracze sa gotowi.");
                }

                return Task.FromResult(current with
                {
                    State = RoomState.CategorySelection,
                    Categories = SelectCategoryChoices([]),
                    CurrentRound = 1,
                    CurrentQuestionIndex = 0,
                    CurrentCategoryId = null,
                    CurrentQuestion = null,
                    LastQuestionResult = null,
                    CategoryVotes = new Dictionary<string, string>(),
                    Answers = new Dictionary<string, SubmittedAnswer>(),
                    SelectedCategoryIds = [],
                    Leaderboard = BuildLeaderboard(current.Players, current.Leaderboard)
                });
            },
            cancellationToken);

        await PublishRoomAsync(room.Code, GameEvents.GameStarted, room, cancellationToken);
        await PublishCategorySelectionStartedAsync(room, cancellationToken);
        ScheduleCategorySelectionTimeout(room.Code, room.CurrentRound);

        return room;
    }

    public async Task<CategoryVoteSummary> VoteCategoryAsync(
        string code,
        CategoryVoteRequest request,
        CancellationToken cancellationToken)
    {
        var shouldStartQuestion = false;
        var room = await _roomStore.UpdateAsync(
            NormalizeRoomCode(code),
            (current, _) =>
            {
                EnsureState(current, RoomState.CategorySelection);
                EnsurePlayer(current, request.PlayerId);

                var category = current.Categories.FirstOrDefault(category =>
                    string.Equals(category.Id, request.CategoryId, StringComparison.OrdinalIgnoreCase));
                if (category is null)
                {
                    throw new GameException(
                        StatusCodes.Status400BadRequest,
                        "invalid_category",
                        "Kategoria nie jest dostepna w tej rundzie.");
                }

                var votes = current.CategoryVotes.ToDictionary();
                votes[request.PlayerId] = category.Id;
                shouldStartQuestion = votes.Count >= current.Players.Count;

                return Task.FromResult(current with { CategoryVotes = votes });
            },
            cancellationToken);

        var summary = new CategoryVoteSummary(room.Code, request.CategoryId, BuildVoteCounts(room));
        await PublishAsync(room.Code, GameEvents.CategoryVoteUpdated, summary, cancellationToken);

        if (shouldStartQuestion)
        {
            await StartQuestionFromVotesAsync(room.Code, room.CurrentRound, cancellationToken);
        }

        return summary;
    }

    public async Task<AnswerSubmittedSummary> SubmitAnswerAsync(
        string code,
        SubmitAnswerRequest request,
        CancellationToken cancellationToken)
    {
        var shouldPublishResult = false;
        var room = await _roomStore.UpdateAsync(
            NormalizeRoomCode(code),
            (current, _) =>
            {
                EnsureState(current, RoomState.Question);
                EnsurePlayer(current, request.PlayerId);

                if (current.CurrentQuestion is null ||
                    !string.Equals(current.CurrentQuestion.Id, request.QuestionId, StringComparison.OrdinalIgnoreCase))
                {
                    throw new GameException(
                        StatusCodes.Status400BadRequest,
                        "invalid_question",
                        "Odpowiedz dotyczy innego pytania.");
                }

                if (current.QuestionStartedAtUtc is { } questionStartedAt &&
                    DateTimeOffset.UtcNow > questionStartedAt.AddSeconds(
                        current.CurrentQuestion.TimeLimitSeconds + QuestionIntroSeconds))
                {
                    throw new GameException(
                        StatusCodes.Status409Conflict,
                        "question_time_expired",
                        "Limit czasu na odpowiedz minal.");
                }

                if (request.AnsweredAtMs < 0 ||
                    request.AnsweredAtMs > current.CurrentQuestion.TimeLimitSeconds * 1_000)
                {
                    throw new GameException(
                        StatusCodes.Status400BadRequest,
                        "invalid_answer_time",
                        "Czas odpowiedzi jest poza limitem pytania.");
                }

                if (current.Answers.ContainsKey(request.PlayerId))
                {
                    throw new GameException(
                        StatusCodes.Status409Conflict,
                        "answer_already_submitted",
                        "Gracz juz odpowiedzial na to pytanie.");
                }

                var question = _questionBank.GetQuestion(request.QuestionId);
                if (question is null ||
                    question.Answers.All(answer => !string.Equals(answer.Id, request.AnswerId, StringComparison.OrdinalIgnoreCase)))
                {
                    throw new GameException(
                        StatusCodes.Status400BadRequest,
                        "invalid_answer",
                        "Nieprawidlowa odpowiedz.");
                }

                var answers = current.Answers.ToDictionary();
                answers[request.PlayerId] = new SubmittedAnswer
                {
                    PlayerId = request.PlayerId,
                    QuestionId = request.QuestionId,
                    AnswerId = request.AnswerId,
                    AnsweredAtMs = request.AnsweredAtMs
                };

                shouldPublishResult = answers.Count >= current.Players.Count;

                return Task.FromResult(current with { Answers = answers });
            },
            cancellationToken);

        var summary = new AnswerSubmittedSummary(
            room.Code,
            request.PlayerId,
            request.QuestionId,
            room.Answers.Count,
            room.Players.Count);

        await PublishAsync(room.Code, GameEvents.AnswerSubmitted, summary, cancellationToken);

        if (shouldPublishResult)
        {
            await PublishQuestionResultAsync(room.Code, request.QuestionId, cancellationToken);
        }

        return summary;
    }

    public async Task<Room> GetRoomAsync(string code, CancellationToken cancellationToken)
    {
        var room = await _roomStore.GetAsync(NormalizeRoomCode(code), cancellationToken);
        if (room is null)
        {
            throw new GameException(StatusCodes.Status404NotFound, "room_not_found", "Pokoj nie istnieje.");
        }

        return room;
    }

    private async Task StartQuestionFromVotesAsync(
        string code,
        int expectedRound,
        CancellationToken cancellationToken)
    {
        var questionStarted = false;
        Room? updatedRoom = null;

        try
        {
            updatedRoom = await _roomStore.UpdateAsync(
                NormalizeRoomCode(code),
                (current, _) =>
                {
                    if (current.State != RoomState.CategorySelection || current.CurrentRound != expectedRound)
                    {
                        return Task.FromResult(current);
                    }

                    var categoryId = SelectWinningCategory(current);
                    var question = GetQuestionFor(categoryId, 1, current.Settings.AnswerTimeSeconds);

                    questionStarted = true;
                    return Task.FromResult(current with
                    {
                        State = RoomState.Question,
                        CurrentCategoryId = categoryId,
                        CurrentQuestionIndex = 1,
                        CurrentQuestion = question,
                        QuestionStartedAtUtc = DateTimeOffset.UtcNow,
                        LastQuestionResult = null,
                        Answers = new Dictionary<string, SubmittedAnswer>(),
                        CategoryVotes = new Dictionary<string, string>(),
                        SelectedCategoryIds = current.SelectedCategoryIds.Append(categoryId).ToList()
                    });
                },
                cancellationToken);
        }
        catch (GameException exception) when (exception.Code == "room_not_found")
        {
            return;
        }

        if (!questionStarted || updatedRoom?.CurrentQuestion is null)
        {
            return;
        }

        await PublishRoomAsync(updatedRoom.Code, GameEvents.QuestionStarted, updatedRoom, cancellationToken);
        ScheduleQuestionTimeout(
            updatedRoom.Code,
            updatedRoom.CurrentQuestion.Id,
            updatedRoom.CurrentQuestion.TimeLimitSeconds);
    }

    private async Task PublishQuestionResultAsync(string code, string questionId, CancellationToken cancellationToken)
    {
        var resultPublished = false;
        Room? updatedRoom = null;

        try
        {
            updatedRoom = await _roomStore.UpdateAsync(
                NormalizeRoomCode(code),
                (current, _) =>
                {
                    if (current.State != RoomState.Question ||
                        current.CurrentQuestion is null ||
                        !string.Equals(current.CurrentQuestion.Id, questionId, StringComparison.OrdinalIgnoreCase))
                    {
                        return Task.FromResult(current);
                    }

                    var questionDefinition = _questionBank.GetQuestion(questionId);
                    if (questionDefinition is null)
                    {
                        throw new GameException(
                            StatusCodes.Status500InternalServerError,
                            "question_missing",
                            "Pytanie nie istnieje w banku pytan.");
                    }

                    var previousLeaderboard = current.Leaderboard;
                    var pointsByPlayerId = CalculateQuestionPoints(current, questionDefinition);
                    var scoredPlayers = current.Players
                        .Select(player => player with { Score = player.Score + pointsByPlayerId[player.Id] })
                        .ToList();

                    var leaderboard = BuildLeaderboard(scoredPlayers, previousLeaderboard);
                    var rankByPlayer = leaderboard.ToDictionary(entry => entry.PlayerId, StringComparer.OrdinalIgnoreCase);
                    var players = scoredPlayers
                        .Select(player => player with { Rank = rankByPlayer[player.Id].Rank })
                        .ToList();

                    var correctAnswer = questionDefinition.Answers.First(answer =>
                        string.Equals(answer.Id, questionDefinition.CorrectAnswerId, StringComparison.OrdinalIgnoreCase));

                    var playerResults = players
                        .Select(player =>
                        {
                            current.Answers.TryGetValue(player.Id, out var submittedAnswer);
                            var entry = rankByPlayer[player.Id];
                            var isCorrect = pointsByPlayerId[player.Id] > 0;
                            var previousRank = GetPreviousRank(previousLeaderboard, player.Id, entry.Rank);

                            return new PlayerQuestionResult
                            {
                                PlayerId = player.Id,
                                SelectedAnswerId = submittedAnswer?.AnswerId,
                                IsCorrect = isCorrect,
                                PointsGained = pointsByPlayerId[player.Id],
                                TotalPoints = player.Score,
                                Rank = entry.Rank,
                                PreviousRank = previousRank,
                                RankChange = previousRank - entry.Rank
                            };
                        })
                        .ToList();

                    var result = new QuestionResult
                    {
                        QuestionId = questionId,
                        CorrectAnswerId = questionDefinition.CorrectAnswerId,
                        CorrectAnswerText = correctAnswer.Text,
                        PlayerResults = playerResults,
                        Leaderboard = leaderboard
                    };

                    resultPublished = true;
                    return Task.FromResult(current with
                    {
                        State = RoomState.QuestionResult,
                        Players = players,
                        LastQuestionResult = result,
                        Leaderboard = leaderboard
                    });
                },
                cancellationToken);
        }
        catch (GameException exception) when (exception.Code == "room_not_found")
        {
            return;
        }

        if (!resultPublished || updatedRoom?.LastQuestionResult is null)
        {
            return;
        }

        await PublishAsync(
            updatedRoom.Code,
            GameEvents.QuestionResultPublished,
            updatedRoom.LastQuestionResult,
            cancellationToken);
        await PublishAsync(updatedRoom.Code, GameEvents.LeaderboardUpdated, updatedRoom.Leaderboard, cancellationToken);
        ScheduleAdvanceAfterResult(updatedRoom.Code, updatedRoom.LastQuestionResult.QuestionId);
    }

    private async Task AdvanceAfterResultAsync(string code, string questionId, CancellationToken cancellationToken)
    {
        Room? updatedRoom = null;
        var nextState = RoomState.QuestionResult;
        var nextQuestionStarted = false;
        var categorySelectionStarted = false;
        var gameFinished = false;

        try
        {
            updatedRoom = await _roomStore.UpdateAsync(
                NormalizeRoomCode(code),
                (current, _) =>
                {
                    if (current.State != RoomState.QuestionResult ||
                        current.LastQuestionResult is null ||
                        !string.Equals(current.LastQuestionResult.QuestionId, questionId, StringComparison.OrdinalIgnoreCase))
                    {
                        return Task.FromResult(current);
                    }

                    if (current.CurrentQuestionIndex < current.Settings.QuestionsPerRound)
                    {
                        if (current.CurrentCategoryId is null)
                        {
                            throw new GameException(
                                StatusCodes.Status500InternalServerError,
                                "category_missing",
                                "Brak aktualnej kategorii.");
                        }

                        var nextIndex = current.CurrentQuestionIndex + 1;
                        var nextQuestion = GetQuestionFor(
                            current.CurrentCategoryId,
                            nextIndex,
                            current.Settings.AnswerTimeSeconds);

                        nextState = RoomState.Question;
                        nextQuestionStarted = true;

                        return Task.FromResult(current with
                        {
                            State = RoomState.Question,
                            CurrentQuestionIndex = nextIndex,
                            CurrentQuestion = nextQuestion,
                            QuestionStartedAtUtc = DateTimeOffset.UtcNow,
                            LastQuestionResult = null,
                            Answers = new Dictionary<string, SubmittedAnswer>()
                        });
                    }

                    if (current.CurrentRound < current.Settings.RoundsCount)
                    {
                        nextState = RoomState.CategorySelection;
                        categorySelectionStarted = true;

                        return Task.FromResult(current with
                        {
                            State = RoomState.CategorySelection,
                            Categories = SelectCategoryChoices(current.SelectedCategoryIds),
                            CurrentRound = current.CurrentRound + 1,
                            CurrentQuestionIndex = 0,
                            CurrentCategoryId = null,
                            CurrentQuestion = null,
                            LastQuestionResult = null,
                            Answers = new Dictionary<string, SubmittedAnswer>(),
                            CategoryVotes = new Dictionary<string, string>(),
                            QuestionStartedAtUtc = null
                        });
                    }

                    nextState = RoomState.Finished;
                    gameFinished = true;

                    return Task.FromResult(current with
                    {
                        State = RoomState.Finished,
                        CurrentQuestion = null,
                        LastQuestionResult = null,
                        Answers = new Dictionary<string, SubmittedAnswer>(),
                        CategoryVotes = new Dictionary<string, string>(),
                        QuestionStartedAtUtc = null,
                        FinishedAtUtc = DateTimeOffset.UtcNow
                    });
                },
                cancellationToken);
        }
        catch (GameException exception) when (exception.Code == "room_not_found")
        {
            return;
        }

        if (updatedRoom is null)
        {
            return;
        }

        if (nextQuestionStarted && updatedRoom.CurrentQuestion is not null)
        {
            await PublishRoomAsync(updatedRoom.Code, GameEvents.QuestionStarted, updatedRoom, cancellationToken);
            ScheduleQuestionTimeout(
                updatedRoom.Code,
                updatedRoom.CurrentQuestion.Id,
                updatedRoom.CurrentQuestion.TimeLimitSeconds);
        }
        else if (categorySelectionStarted)
        {
            await PublishCategorySelectionStartedAsync(updatedRoom, cancellationToken);
            ScheduleCategorySelectionTimeout(updatedRoom.Code, updatedRoom.CurrentRound);
        }
        else if (gameFinished || nextState == RoomState.Finished)
        {
            await PublishRoomAsync(updatedRoom.Code, GameEvents.GameFinished, updatedRoom, cancellationToken);
        }
    }

    private void ScheduleCategorySelectionTimeout(string code, int round)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(CategorySelectionSeconds));
                await StartQuestionFromVotesAsync(code, round, CancellationToken.None);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Category selection timeout failed for room {RoomCode}.", code);
            }
        });
    }

    private void ScheduleQuestionTimeout(string code, string questionId, int answerTimeSeconds)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(answerTimeSeconds + QuestionIntroSeconds));
                await PublishQuestionResultAsync(code, questionId, CancellationToken.None);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Question timeout failed for room {RoomCode}.", code);
            }
        });
    }

    private void ScheduleAdvanceAfterResult(string code, string questionId)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(ResultDisplaySeconds));
                await AdvanceAfterResultAsync(code, questionId, CancellationToken.None);
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Result advance failed for room {RoomCode}.", code);
            }
        });
    }

    private async Task PublishCategorySelectionStartedAsync(Room room, CancellationToken cancellationToken)
    {
        await PublishAsync(
            room.Code,
            GameEvents.CategorySelectionStarted,
            new
            {
                room.Code,
                room.CurrentRound,
                room.Settings.RoundsCount,
                SelectionTimeSeconds = CategorySelectionSeconds,
                Categories = room.Categories
            },
            cancellationToken);
    }

    private async Task PublishAsync(
        string roomCode,
        string eventName,
        object payload,
        CancellationToken cancellationToken)
    {
        await _hubContext
            .Clients
            .Group(GameHub.NormalizeRoomCode(roomCode))
            .SendAsync(eventName, payload, cancellationToken);
    }

    private Task PublishRoomAsync(
        string roomCode,
        string eventName,
        Room room,
        CancellationToken cancellationToken)
    {
        return PublishAsync(roomCode, eventName, RoomSnapshot.FromRoom(room), cancellationToken);
    }

    private string SelectWinningCategory(Room room)
    {
        if (room.CategoryVotes.Count == 0)
        {
            return room.Categories.First().Id;
        }

        return room.CategoryVotes
            .Values
            .GroupBy(categoryId => categoryId, StringComparer.OrdinalIgnoreCase)
            .OrderByDescending(group => group.Count())
            .ThenBy(group => room.Categories.ToList().FindIndex(category =>
                string.Equals(category.Id, group.Key, StringComparison.OrdinalIgnoreCase)))
            .First()
            .Key;
    }

    private IReadOnlyList<Category> SelectCategoryChoices(IReadOnlyList<string> selectedCategoryIds)
    {
        var selectedCategoryIdSet = selectedCategoryIds.ToHashSet(StringComparer.OrdinalIgnoreCase);
        var availableCategories = _questionBank.Categories
            .Where(category => !selectedCategoryIdSet.Contains(category.Id))
            .ToList();

        if (availableCategories.Count < CategoryChoicesPerRound)
        {
            throw new GameException(
                StatusCodes.Status500InternalServerError,
                "question_bank_too_small",
                "Bank pytan nie ma wystarczajacej liczby kategorii dla liczby rund.");
        }

        return availableCategories
            .OrderBy(_ => RandomNumberGenerator.GetInt32(int.MaxValue))
            .Take(CategoryChoicesPerRound)
            .ToList();
    }

    private Question GetQuestionFor(string categoryId, int questionIndex, int timeLimitSeconds)
    {
        var questions = _questionBank.GetQuestions(categoryId);
        if (questions.Count < questionIndex)
        {
            throw new GameException(
                StatusCodes.Status500InternalServerError,
                "question_bank_too_small",
                "Bank pytan nie ma wystarczajacej liczby pytan dla kategorii.");
        }

        var question = questions[questionIndex - 1].ToQuestion(timeLimitSeconds);
        return question with { Answers = ShuffleAnswers(question.Answers) };
    }

    private static IReadOnlyList<Answer> ShuffleAnswers(IReadOnlyList<Answer> answers)
    {
        var shuffledAnswers = answers.ToList();
        for (var index = shuffledAnswers.Count - 1; index > 0; index--)
        {
            var swapIndex = RandomNumberGenerator.GetInt32(index + 1);
            (shuffledAnswers[index], shuffledAnswers[swapIndex]) = (shuffledAnswers[swapIndex], shuffledAnswers[index]);
        }

        return shuffledAnswers
            .Select((answer, index) => answer with { Letter = CreateAnswerLetter(index) })
            .ToList();
    }

    private static string CreateAnswerLetter(int index)
    {
        return index < AnswerLetterAlphabet.Length
            ? AnswerLetterAlphabet[index].ToString()
            : (index + 1).ToString();
    }

    private static IReadOnlyDictionary<string, int> BuildVoteCounts(Room room)
    {
        return room.CategoryVotes
            .Values
            .GroupBy(categoryId => categoryId, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(group => group.Key, group => group.Count(), StringComparer.OrdinalIgnoreCase);
    }

    private static List<Player> ApplyHost(
        IReadOnlyList<Player> players,
        string hostPlayerId,
        bool markHostReady)
    {
        return players
            .Select(player =>
            {
                var isHost = string.Equals(player.Id, hostPlayerId, StringComparison.OrdinalIgnoreCase);
                return player with
                {
                    IsHost = isHost,
                    IsReady = markHostReady && isHost ? true : player.IsReady
                };
            })
            .ToList();
    }

    private static IReadOnlyList<ScoreEntry> BuildLeaderboard(
        IReadOnlyList<Player> players,
        IReadOnlyList<ScoreEntry> previousLeaderboard)
    {
        var previousRankByPlayer = previousLeaderboard.ToDictionary(
            entry => entry.PlayerId,
            entry => entry.Rank,
            StringComparer.OrdinalIgnoreCase);

        var orderedPlayers = players
            .OrderByDescending(player => player.Score)
            .ThenBy(player => player.Name, StringComparer.OrdinalIgnoreCase)
            .ToList();

        var leaderboard = new List<ScoreEntry>(orderedPlayers.Count);
        int? previousPoints = null;
        var currentRank = 0;

        for (var index = 0; index < orderedPlayers.Count; index++)
        {
            var player = orderedPlayers[index];
            if (previousPoints != player.Score)
            {
                currentRank = index + 1;
                previousPoints = player.Score;
            }

            var previousRank = previousRankByPlayer.GetValueOrDefault(player.Id, currentRank);
            leaderboard.Add(new ScoreEntry
            {
                PlayerId = player.Id,
                PlayerName = player.Name,
                Points = player.Score,
                Rank = currentRank,
                PreviousRank = previousRank,
                RankChange = previousRank - currentRank
            });
        }

        return leaderboard;
    }

    private static int GetPreviousRank(IReadOnlyList<ScoreEntry> previousLeaderboard, string playerId, int fallbackRank)
    {
        return previousLeaderboard
            .FirstOrDefault(entry => string.Equals(entry.PlayerId, playerId, StringComparison.OrdinalIgnoreCase))
            ?.Rank ?? fallbackRank;
    }

    private static IReadOnlyDictionary<string, int> CalculateQuestionPoints(
        Room room,
        QuestionDefinition questionDefinition)
    {
        var correctPlayerIds = room.Answers
            .Values
            .Where(answer => string.Equals(
                answer.AnswerId,
                questionDefinition.CorrectAnswerId,
                StringComparison.OrdinalIgnoreCase))
            .Select(answer => answer.PlayerId)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);
        var pointsPerCorrectPlayer = correctPlayerIds.Count == 0
            ? 0
            : questionDefinition.PointsPool / correctPlayerIds.Count;

        return room.Players.ToDictionary(
            player => player.Id,
            player => correctPlayerIds.Contains(player.Id) ? pointsPerCorrectPlayer : 0,
            StringComparer.OrdinalIgnoreCase);
    }

    private static void EnsureHost(Room room, string hostPlayerId)
    {
        if (!string.Equals(room.HostPlayerId, hostPlayerId, StringComparison.OrdinalIgnoreCase))
        {
            throw new GameException(StatusCodes.Status403Forbidden, "not_host", "Tylko host moze wykonac te akcje.");
        }
    }

    private static Player EnsurePlayer(Room room, string playerId)
    {
        var player = room.Players.FirstOrDefault(player =>
            string.Equals(player.Id, playerId, StringComparison.OrdinalIgnoreCase));
        if (player is null)
        {
            throw new GameException(StatusCodes.Status404NotFound, "player_not_found", "Gracz nie istnieje w pokoju.");
        }

        return player;
    }

    private static void EnsureState(Room room, RoomState expectedState)
    {
        if (room.State != expectedState)
        {
            throw new GameException(
                StatusCodes.Status409Conflict,
                "invalid_room_state",
                $"Akcja niedozwolona w stanie {room.State}.");
        }
    }

    private static void ValidateSettings(GameSettings settings, int currentPlayersCount)
    {
        if (settings.QuestionsPerRound is < 1 or > 8)
        {
            throw new GameException(
                StatusCodes.Status400BadRequest,
                "invalid_questions_per_round",
                "Liczba pytan w rundzie musi byc od 1 do 8.");
        }

        if (settings.RoundsCount is < 1 or > 5)
        {
            throw new GameException(
                StatusCodes.Status400BadRequest,
                "invalid_rounds_count",
                "Liczba rund musi byc od 1 do 5.");
        }

        if (settings.AnswerTimeSeconds is < 5 or > 60)
        {
            throw new GameException(
                StatusCodes.Status400BadRequest,
                "invalid_answer_time_seconds",
                "Limit czasu odpowiedzi musi byc od 5 do 60 sekund.");
        }

        if (settings.MaxPlayers is < 1 or > 24)
        {
            throw new GameException(
                StatusCodes.Status400BadRequest,
                "invalid_max_players",
                "Maksymalna liczba graczy musi byc od 1 do 24.");
        }

        if (settings.MaxPlayers < currentPlayersCount)
        {
            throw new GameException(
                StatusCodes.Status400BadRequest,
                "max_players_below_current_count",
                "Maksymalna liczba graczy nie moze byc mniejsza niz obecna liczba graczy.");
        }
    }

    private static string ValidatePlayerName(string playerName)
    {
        var normalized = playerName.Trim();
        if (normalized.Length is < 2 or > 32)
        {
            throw new GameException(
                StatusCodes.Status400BadRequest,
                "invalid_player_name",
                "Nazwa gracza musi miec od 2 do 32 znakow.");
        }

        return normalized;
    }

    private static string? NormalizeOptionalText(string? value)
    {
        var normalized = value?.Trim();
        return string.IsNullOrWhiteSpace(normalized) ? null : normalized;
    }

    private static string NormalizeRoomCode(string code)
    {
        return code.Trim().ToUpperInvariant();
    }

    private static string CreatePlayerId()
    {
        return $"player-{Guid.NewGuid():N}";
    }

    private static string GenerateRoomCode()
    {
        Span<char> code = stackalloc char[RoomCodeLength];
        for (var index = 0; index < code.Length; index++)
        {
            code[index] = RoomCodeAlphabet[RandomNumberGenerator.GetInt32(RoomCodeAlphabet.Length)];
        }

        return new string(code);
    }
}
