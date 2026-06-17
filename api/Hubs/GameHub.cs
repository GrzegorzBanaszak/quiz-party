using Microsoft.AspNetCore.SignalR;

namespace PartyQuiz.Api.Hubs;

public static class GameEvents
{
    public const string PlayerJoined = "PlayerJoined";
    public const string PlayerReadyChanged = "PlayerReadyChanged";
    public const string RoomSettingsChanged = "RoomSettingsChanged";
    public const string GameStarted = "GameStarted";
    public const string CategorySelectionStarted = "CategorySelectionStarted";
    public const string CategoryVoteUpdated = "CategoryVoteUpdated";
    public const string QuestionStarted = "QuestionStarted";
    public const string AnswerSubmitted = "AnswerSubmitted";
    public const string QuestionResultPublished = "QuestionResultPublished";
    public const string LeaderboardUpdated = "LeaderboardUpdated";
    public const string GameFinished = "GameFinished";
}

public sealed class GameHub : Hub
{
    public Task JoinRoom(string roomCode)
    {
        return Groups.AddToGroupAsync(Context.ConnectionId, NormalizeRoomCode(roomCode));
    }

    public Task LeaveRoom(string roomCode)
    {
        return Groups.RemoveFromGroupAsync(Context.ConnectionId, NormalizeRoomCode(roomCode));
    }

    public static string NormalizeRoomCode(string roomCode)
    {
        return roomCode.Trim().ToUpperInvariant();
    }
}
