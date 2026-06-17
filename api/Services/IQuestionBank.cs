using PartyQuiz.Api.Domain;

namespace PartyQuiz.Api.Services;

public interface IQuestionBank
{
    IReadOnlyList<Category> Categories { get; }
    Category? GetCategory(string categoryId);
    IReadOnlyList<QuestionDefinition> GetQuestions(string categoryId);
    QuestionDefinition? GetQuestion(string questionId);
}
