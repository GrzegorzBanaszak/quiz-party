using PartyQuiz.Api.Contracts;
using PartyQuiz.Api.Services;

namespace PartyQuiz.Api.Endpoints;

public static class RoomEndpoints
{
    public static IEndpointRouteBuilder MapRoomEndpoints(this IEndpointRouteBuilder app)
    {
        var rooms = app.MapGroup("/api/rooms");

        rooms.MapPost("/", async (
            CreateRoomRequest request,
            GameService gameService,
            CancellationToken cancellationToken) =>
        {
            return Results.Created(
                "/api/rooms",
                await gameService.CreateRoomAsync(request, cancellationToken));
        });

        rooms.MapPost("/{code}/players", async (
            string code,
            JoinRoomRequest request,
            GameService gameService,
            CancellationToken cancellationToken) =>
        {
            return Results.Ok(await gameService.JoinRoomAsync(code, request, cancellationToken));
        });

        rooms.MapPatch("/{code}/settings", async (
            string code,
            UpdateRoomSettingsRequest request,
            GameService gameService,
            CancellationToken cancellationToken) =>
        {
            return Results.Ok(RoomSnapshot.FromRoom(
                await gameService.UpdateSettingsAsync(code, request, cancellationToken)));
        });

        rooms.MapPatch("/{code}/players/{playerId}/ready", async (
            string code,
            string playerId,
            SetPlayerReadyRequest request,
            GameService gameService,
            CancellationToken cancellationToken) =>
        {
            return Results.Ok(RoomSnapshot.FromRoom(
                await gameService.SetReadyAsync(code, playerId, request, cancellationToken)));
        });

        rooms.MapPost("/{code}/start", async (
            string code,
            StartGameRequest request,
            GameService gameService,
            CancellationToken cancellationToken) =>
        {
            return Results.Ok(RoomSnapshot.FromRoom(
                await gameService.StartGameAsync(code, request, cancellationToken)));
        });

        rooms.MapPost("/{code}/category-votes", async (
            string code,
            CategoryVoteRequest request,
            GameService gameService,
            CancellationToken cancellationToken) =>
        {
            return Results.Ok(await gameService.VoteCategoryAsync(code, request, cancellationToken));
        });

        rooms.MapPost("/{code}/answers", async (
            string code,
            SubmitAnswerRequest request,
            GameService gameService,
            CancellationToken cancellationToken) =>
        {
            return Results.Ok(await gameService.SubmitAnswerAsync(code, request, cancellationToken));
        });

        rooms.MapGet("/{code}", async (
            string code,
            GameService gameService,
            CancellationToken cancellationToken) =>
        {
            return Results.Ok(RoomSnapshot.FromRoom(await gameService.GetRoomAsync(code, cancellationToken)));
        });

        return app;
    }
}
