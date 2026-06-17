using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using PartyQuiz.Api.Domain;
using StackExchange.Redis;

namespace PartyQuiz.Api.Infrastructure;

public sealed class RedisRoomStore : IRoomStore
{
    private const int LockAcquireTimeoutMs = 2_000;
    private const int LockRetryDelayMs = 40;

    private readonly IDatabase _database;
    private readonly RedisOptions _options;
    private readonly JsonSerializerOptions _jsonOptions;

    public RedisRoomStore(IConnectionMultiplexer connectionMultiplexer, IOptions<RedisOptions> options)
    {
        _database = connectionMultiplexer.GetDatabase();
        _options = options.Value;
        _jsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);
        _jsonOptions.Converters.Add(new JsonStringEnumConverter());
    }

    public TimeSpan ActiveRoomTtl => TimeSpan.FromMinutes(_options.ActiveRoomTtlMinutes);

    public TimeSpan FinishedRoomTtl => TimeSpan.FromMinutes(_options.FinishedRoomTtlMinutes);

    public async Task<Room?> GetAsync(string code, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var value = await _database.StringGetAsync(RoomKey(code));
        if (value.IsNullOrEmpty)
        {
            return null;
        }

        return JsonSerializer.Deserialize<Room>(value!, _jsonOptions);
    }

    public async Task<bool> TryCreateAsync(Room room, TimeSpan ttl, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        return await _database.StringSetAsync(
            RoomKey(room.Code),
            Serialize(room),
            ttl,
            When.NotExists);
    }

    public async Task SaveAsync(Room room, TimeSpan ttl, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        await _database.StringSetAsync(RoomKey(room.Code), Serialize(room), ttl);
    }

    public async Task<Room> UpdateAsync(
        string code,
        Func<Room, CancellationToken, Task<Room>> update,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var lockKey = LockKey(code);
        var lockToken = Guid.NewGuid().ToString("N");
        var acquired = await AcquireLockAsync(lockKey, lockToken, cancellationToken);
        if (!acquired)
        {
            throw new GameException(
                StatusCodes.Status409Conflict,
                "room_busy",
                "Pokoj jest aktualnie aktualizowany. Sprobuj ponownie.");
        }

        try
        {
            var room = await GetAsync(code, cancellationToken);
            if (room is null)
            {
                throw new GameException(StatusCodes.Status404NotFound, "room_not_found", "Pokoj nie istnieje.");
            }

            var updatedRoom = await update(room, cancellationToken);
            updatedRoom = updatedRoom with { UpdatedAtUtc = DateTimeOffset.UtcNow };

            var ttl = updatedRoom.State == RoomState.Finished ? FinishedRoomTtl : ActiveRoomTtl;
            await SaveAsync(updatedRoom, ttl, cancellationToken);

            return updatedRoom;
        }
        finally
        {
            await ReleaseLockAsync(lockKey, lockToken);
        }
    }

    private async Task<bool> AcquireLockAsync(RedisKey lockKey, RedisValue lockToken, CancellationToken cancellationToken)
    {
        var expiresAt = DateTimeOffset.UtcNow.AddMilliseconds(LockAcquireTimeoutMs);
        var lockTtl = TimeSpan.FromSeconds(Math.Max(1, _options.LockSeconds));

        while (DateTimeOffset.UtcNow < expiresAt)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var acquired = await _database.StringSetAsync(lockKey, lockToken, lockTtl, When.NotExists);
            if (acquired)
            {
                return true;
            }

            await Task.Delay(LockRetryDelayMs, cancellationToken);
        }

        return false;
    }

    private async Task ReleaseLockAsync(RedisKey lockKey, RedisValue lockToken)
    {
        const string script = """
            if redis.call('get', KEYS[1]) == ARGV[1] then
                return redis.call('del', KEYS[1])
            else
                return 0
            end
            """;

        await _database.ScriptEvaluateAsync(script, [lockKey], [lockToken]);
    }

    private string Serialize(Room room)
    {
        return JsonSerializer.Serialize(room, _jsonOptions);
    }

    private RedisKey RoomKey(string code)
    {
        return Key($"room:{NormalizeCode(code)}");
    }

    private RedisKey LockKey(string code)
    {
        return Key($"room:{NormalizeCode(code)}:lock");
    }

    private RedisKey Key(string key)
    {
        return string.IsNullOrWhiteSpace(_options.InstanceName)
            ? key
            : $"{_options.InstanceName}:{key}";
    }

    private static string NormalizeCode(string code)
    {
        return code.Trim().ToUpperInvariant();
    }
}
