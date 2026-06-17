using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Json;
using PartyQuiz.Api.Endpoints;
using PartyQuiz.Api.Hubs;
using PartyQuiz.Api.Infrastructure;
using PartyQuiz.Api.Services;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureHttpJsonOptions(ConfigureJson);
builder.Services.Configure<JsonOptions>(ConfigureJson);
builder.Services.Configure<RedisOptions>(builder.Configuration.GetSection(RedisOptions.SectionName));
builder.Services.Configure<QuestionBankOptions>(builder.Configuration.GetSection(QuestionBankOptions.SectionName));
builder.Services.AddExceptionHandler<GameExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173", "https://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services
    .AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddSingleton<IConnectionMultiplexer>(serviceProvider =>
{
    var options = serviceProvider
        .GetRequiredService<Microsoft.Extensions.Options.IOptions<RedisOptions>>()
        .Value;

    return ConnectionMultiplexer.Connect(options.ConnectionString);
});

builder.Services.AddSingleton<IRoomStore, RedisRoomStore>();
builder.Services.AddSingleton<IQuestionBank, JsonQuestionBank>();
builder.Services.AddSingleton<GameService>();

var app = builder.Build();
_ = app.Services.GetRequiredService<IQuestionBank>();

app.UseExceptionHandler();
app.UseHttpsRedirection();
app.UseCors("Frontend");

app.MapHub<GameHub>("/hubs/game");
app.MapRoomEndpoints();

app.Run();

static void ConfigureJson(JsonOptions options)
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
}
