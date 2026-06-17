namespace PartyQuiz.Api.Infrastructure;

public sealed record RedisOptions
{
    public const string SectionName = "Redis";

    public string ConnectionString { get; init; } = "localhost:6379";
    public string InstanceName { get; init; } = "party-quiz";
    public int ActiveRoomTtlMinutes { get; init; } = 120;
    public int FinishedRoomTtlMinutes { get; init; } = 60;
    public int LockSeconds { get; init; } = 5;
}
