using PartyQuiz.Api.Domain;

namespace PartyQuiz.Api.Contracts;

public sealed record CreateRoomRequest
{
    public required string PlayerName { get; init; }
    public string? Avatar { get; init; }
}

public sealed record JoinRoomRequest
{
    public required string PlayerName { get; init; }
    public string? Avatar { get; init; }
}

public sealed record UpdateRoomSettingsRequest
{
    public required string HostPlayerId { get; init; }
    public int? QuestionsPerRound { get; init; }
    public int? RoundsCount { get; init; }
    public int? AnswerTimeSeconds { get; init; }
    public int? MaxPlayers { get; init; }
}

public sealed record SetPlayerReadyRequest
{
    public bool IsReady { get; init; }
}

public sealed record StartGameRequest
{
    public required string HostPlayerId { get; init; }
}

public sealed record CategoryVoteRequest
{
    public required string PlayerId { get; init; }
    public required string CategoryId { get; init; }
}

public sealed record SubmitAnswerRequest
{
    public required string PlayerId { get; init; }
    public required string QuestionId { get; init; }
    public required string AnswerId { get; init; }
    public int AnsweredAtMs { get; init; }
}

public sealed record ReturnToLobbyRequest
{
    public required string PlayerId { get; init; }
}

public sealed record CreateRoomResponse(string RoomCode, string PlayerId, RoomState State);

public sealed record JoinRoomResponse(string RoomCode, string PlayerId, RoomState State);

public sealed record RoomSnapshot
{
    public required string Code { get; init; }
    public RoomState State { get; init; }
    public required string HostPlayerId { get; init; }
    public required GameSettings Settings { get; init; }
    public required IReadOnlyList<Player> Players { get; init; }
    public required IReadOnlyList<Category> Categories { get; init; }
    public int CurrentRound { get; init; }
    public int CurrentQuestionIndex { get; init; }
    public string? CurrentCategoryId { get; init; }
    public Question? CurrentQuestion { get; init; }
    public QuestionResult? LastQuestionResult { get; init; }
    public required IReadOnlyList<ScoreEntry> Leaderboard { get; init; }
    public required IReadOnlyList<string> SelectedCategoryIds { get; init; }
    public required IReadOnlyDictionary<string, int> CategoryVoteCounts { get; init; }
    public int AnsweredCount { get; init; }
    public int TotalPlayers { get; init; }
    public DateTimeOffset CreatedAtUtc { get; init; }
    public DateTimeOffset UpdatedAtUtc { get; init; }
    public DateTimeOffset? QuestionStartedAtUtc { get; init; }
    public DateTimeOffset? FinishedAtUtc { get; init; }

    public static RoomSnapshot FromRoom(Room room)
    {
        return new RoomSnapshot
        {
            Code = room.Code,
            State = room.State,
            HostPlayerId = room.HostPlayerId,
            Settings = room.Settings,
            Players = room.Players,
            Categories = room.Categories,
            CurrentRound = room.CurrentRound,
            CurrentQuestionIndex = room.CurrentQuestionIndex,
            CurrentCategoryId = room.CurrentCategoryId,
            CurrentQuestion = room.CurrentQuestion,
            LastQuestionResult = room.LastQuestionResult,
            Leaderboard = room.Leaderboard,
            SelectedCategoryIds = room.SelectedCategoryIds,
            CategoryVoteCounts = room.CategoryVotes
                .Values
                .GroupBy(categoryId => categoryId, StringComparer.OrdinalIgnoreCase)
                .ToDictionary(group => group.Key, group => group.Count(), StringComparer.OrdinalIgnoreCase),
            AnsweredCount = room.Answers.Count,
            TotalPlayers = room.Players.Count,
            CreatedAtUtc = room.CreatedAtUtc,
            UpdatedAtUtc = room.UpdatedAtUtc,
            QuestionStartedAtUtc = room.QuestionStartedAtUtc,
            FinishedAtUtc = room.FinishedAtUtc
        };
    }
}

public sealed record CategoryVoteSummary(
    string RoomCode,
    string CategoryId,
    IReadOnlyDictionary<string, int> VoteCounts);

public sealed record AnswerSubmittedSummary(
    string RoomCode,
    string PlayerId,
    string QuestionId,
    int AnsweredCount,
    int TotalPlayers);
