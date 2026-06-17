using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using PartyQuiz.Api.Domain;

namespace PartyQuiz.Api.Infrastructure;

public sealed class GameExceptionHandler : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        if (exception is not GameException gameException)
        {
            return false;
        }

        var problemDetails = new ProblemDetails
        {
            Status = gameException.StatusCode,
            Title = gameException.Code,
            Detail = gameException.Message,
            Extensions =
            {
                ["code"] = gameException.Code
            }
        };

        httpContext.Response.StatusCode = gameException.StatusCode;
        await Results.Problem(problemDetails).ExecuteAsync(httpContext);

        return true;
    }
}
