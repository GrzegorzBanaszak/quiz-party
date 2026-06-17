using PartyQuiz.Api.Domain;

namespace PartyQuiz.Api.Infrastructure;

public interface IRoomStore
{
    TimeSpan ActiveRoomTtl { get; }
    TimeSpan FinishedRoomTtl { get; }

    Task<Room?> GetAsync(string code, CancellationToken cancellationToken);
    Task<bool> TryCreateAsync(Room room, TimeSpan ttl, CancellationToken cancellationToken);
    Task SaveAsync(Room room, TimeSpan ttl, CancellationToken cancellationToken);
    Task<Room> UpdateAsync(
        string code,
        Func<Room, CancellationToken, Task<Room>> update,
        CancellationToken cancellationToken);
}
