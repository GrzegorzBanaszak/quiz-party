namespace PartyQuiz.Api.Domain;

public enum RoomState
{
    Lobby,
    CategorySelection,
    Question,
    QuestionResult,
    Finished
}

public sealed record GameSettings
{
    public int QuestionsPerRound { get; init; } = 5;
    public int RoundsCount { get; init; } = 3;
    public int AnswerTimeSeconds { get; init; } = 12;
    public int MaxPlayers { get; init; } = 12;
}

public sealed record Player
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public string? Avatar { get; init; }
    public bool IsHost { get; init; }
    public bool IsReady { get; init; }
    public int Score { get; init; }
    public int Rank { get; init; }
}

public sealed record Category
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
}

public sealed record Answer
{
    public required string Id { get; init; }
    public required string Letter { get; init; }
    public required string Text { get; init; }
}

public sealed record Question
{
    public required string Id { get; init; }
    public required string CategoryId { get; init; }
    public required string Text { get; init; }
    public required IReadOnlyList<Answer> Answers { get; init; }
    public int TimeLimitSeconds { get; init; }
}

public sealed record QuestionDefinition
{
    public required string Id { get; init; }
    public required string CategoryId { get; init; }
    public required string Text { get; init; }
    public required IReadOnlyList<Answer> Answers { get; init; }
    public required string CorrectAnswerId { get; init; }
    public int TimeLimitSeconds { get; init; }

    public Question ToQuestion(int timeLimitSeconds)
    {
        return new Question
        {
            Id = Id,
            CategoryId = CategoryId,
            Text = Text,
            Answers = Answers,
            TimeLimitSeconds = timeLimitSeconds
        };
    }
}

public sealed record ScoreEntry
{
    public required string PlayerId { get; init; }
    public required string PlayerName { get; init; }
    public int Points { get; init; }
    public int Rank { get; init; }
    public int PreviousRank { get; init; }
    public int RankChange { get; init; }
}

public sealed record SubmittedAnswer
{
    public required string PlayerId { get; init; }
    public required string QuestionId { get; init; }
    public required string AnswerId { get; init; }
    public int AnsweredAtMs { get; init; }
    public DateTimeOffset SubmittedAtUtc { get; init; } = DateTimeOffset.UtcNow;
}

public sealed record PlayerQuestionResult
{
    public required string PlayerId { get; init; }
    public string? SelectedAnswerId { get; init; }
    public bool IsCorrect { get; init; }
    public int PointsGained { get; init; }
    public int TotalPoints { get; init; }
    public int Rank { get; init; }
    public int PreviousRank { get; init; }
    public int RankChange { get; init; }
}

public sealed record QuestionResult
{
    public required string QuestionId { get; init; }
    public required string CorrectAnswerId { get; init; }
    public required string CorrectAnswerText { get; init; }
    public required IReadOnlyList<PlayerQuestionResult> PlayerResults { get; init; }
    public required IReadOnlyList<ScoreEntry> Leaderboard { get; init; }
}

public sealed record Room
{
    public required string Code { get; init; }
    public RoomState State { get; init; } = RoomState.Lobby;
    public required string HostPlayerId { get; init; }
    public GameSettings Settings { get; init; } = new();
    public IReadOnlyList<Player> Players { get; init; } = [];
    public IReadOnlyList<Category> Categories { get; init; } = [];
    public int CurrentRound { get; init; }
    public int CurrentQuestionIndex { get; init; }
    public string? CurrentCategoryId { get; init; }
    public Question? CurrentQuestion { get; init; }
    public QuestionResult? LastQuestionResult { get; init; }
    public IReadOnlyList<ScoreEntry> Leaderboard { get; init; } = [];
    public IReadOnlyList<string> SelectedCategoryIds { get; init; } = [];
    public IReadOnlyDictionary<string, string> CategoryVotes { get; init; } = new Dictionary<string, string>();
    public IReadOnlyDictionary<string, SubmittedAnswer> Answers { get; init; } = new Dictionary<string, SubmittedAnswer>();
    public DateTimeOffset CreatedAtUtc { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAtUtc { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? QuestionStartedAtUtc { get; init; }
    public DateTimeOffset? FinishedAtUtc { get; init; }
}
