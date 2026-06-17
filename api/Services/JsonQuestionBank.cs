using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Options;
using PartyQuiz.Api.Domain;

namespace PartyQuiz.Api.Services;

public sealed class JsonQuestionBank : IQuestionBank
{
    private readonly IReadOnlyList<Category> _categories;
    private readonly IReadOnlyList<QuestionDefinition> _questions;
    private readonly IReadOnlyDictionary<string, Category> _categoriesById;
    private readonly IReadOnlyDictionary<string, QuestionDefinition> _questionsById;
    private readonly IReadOnlyDictionary<string, IReadOnlyList<QuestionDefinition>> _questionsByCategoryId;

    public JsonQuestionBank(IHostEnvironment environment, IOptions<QuestionBankOptions> options)
    {
        var questionBankOptions = options.Value;
        var filePath = ResolveFilePath(environment.ContentRootPath, questionBankOptions.FilePath);
        var data = Load(filePath);
        var questions = FlattenQuestions(data);

        Validate(data, questions, questionBankOptions.MinimumQuestionsPerCategory, filePath);

        _categories = data.Categories.ToList();
        _questions = questions;
        _categoriesById = _categories.ToDictionary(category => category.Id, StringComparer.OrdinalIgnoreCase);
        _questionsById = _questions.ToDictionary(question => question.Id, StringComparer.OrdinalIgnoreCase);
        _questionsByCategoryId = _questions
            .GroupBy(question => question.CategoryId, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => (IReadOnlyList<QuestionDefinition>)group.ToList(),
                StringComparer.OrdinalIgnoreCase);
    }

    public IReadOnlyList<Category> Categories => _categories;

    public Category? GetCategory(string categoryId)
    {
        return _categoriesById.GetValueOrDefault(categoryId);
    }

    public IReadOnlyList<QuestionDefinition> GetQuestions(string categoryId)
    {
        return _questionsByCategoryId.GetValueOrDefault(categoryId) ?? [];
    }

    public QuestionDefinition? GetQuestion(string questionId)
    {
        return _questionsById.GetValueOrDefault(questionId);
    }

    private static string ResolveFilePath(string contentRootPath, string configuredPath)
    {
        return Path.IsPathRooted(configuredPath)
            ? configuredPath
            : Path.Combine(contentRootPath, configuredPath);
    }

    private static QuestionBankData Load(string filePath)
    {
        if (!File.Exists(filePath))
        {
            throw new InvalidOperationException($"Question bank file was not found: {filePath}");
        }

        try
        {
            using var stream = File.OpenRead(filePath);
            var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);
            options.Converters.Add(new JsonStringEnumConverter());

            return JsonSerializer.Deserialize<QuestionBankData>(stream, options)
                ?? throw new InvalidOperationException($"Question bank file is empty: {filePath}");
        }
        catch (JsonException exception)
        {
            throw new InvalidOperationException($"Question bank file has invalid JSON: {filePath}", exception);
        }
    }

    private static IReadOnlyList<QuestionDefinition> FlattenQuestions(QuestionBankData data)
    {
        return data.Questions
            .SelectMany(group => (group.Value ?? []).Select(question => question.ToQuestionDefinition(group.Key)))
            .ToList();
    }

    private static void Validate(
        QuestionBankData data,
        IReadOnlyList<QuestionDefinition> questions,
        int minimumQuestionsPerCategory,
        string filePath)
    {
        var errors = new List<string>();

        if (data.Categories.Count == 0)
        {
            errors.Add("At least one category is required.");
        }

        if (data.Questions.Count == 0 || questions.Count == 0)
        {
            errors.Add("At least one question is required.");
        }

        var categoryIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var category in data.Categories)
        {
            if (string.IsNullOrWhiteSpace(category.Id))
            {
                errors.Add("Category id is required.");
                continue;
            }

            if (!categoryIds.Add(category.Id))
            {
                errors.Add($"Category id '{category.Id}' is duplicated.");
            }

            if (string.IsNullOrWhiteSpace(category.Name))
            {
                errors.Add($"Category '{category.Id}' has empty name.");
            }
        }

        foreach (var group in data.Questions)
        {
            if (string.IsNullOrWhiteSpace(group.Key))
            {
                errors.Add("Question category id is required.");
            }
            else if (!categoryIds.Contains(group.Key))
            {
                errors.Add($"Question group uses unknown categoryId '{group.Key}'.");
            }

            if (group.Value is null)
            {
                errors.Add($"Question group '{group.Key}' is null.");
            }
        }

        var questionIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var question in questions)
        {
            ValidateQuestion(question, categoryIds, questionIds, errors);
        }

        foreach (var category in data.Categories)
        {
            var questionCount = data.Questions
                .Where(group => string.Equals(group.Key, category.Id, StringComparison.OrdinalIgnoreCase))
                .Sum(group => group.Value?.Count ?? 0);
            if (questionCount < minimumQuestionsPerCategory)
            {
                errors.Add(
                    $"Category '{category.Id}' has {questionCount} questions, but at least {minimumQuestionsPerCategory} are required.");
            }
        }

        if (errors.Count > 0)
        {
            throw new InvalidOperationException(
                $"Question bank file is invalid: {filePath}{Environment.NewLine}- {string.Join($"{Environment.NewLine}- ", errors)}");
        }
    }

    private static void ValidateQuestion(
        QuestionDefinition question,
        HashSet<string> categoryIds,
        HashSet<string> questionIds,
        List<string> errors)
    {
        if (string.IsNullOrWhiteSpace(question.Id))
        {
            errors.Add("Question id is required.");
            return;
        }

        if (!questionIds.Add(question.Id))
        {
            errors.Add($"Question id '{question.Id}' is duplicated.");
        }

        if (string.IsNullOrWhiteSpace(question.CategoryId))
        {
            errors.Add($"Question '{question.Id}' has empty categoryId.");
        }
        else if (!categoryIds.Contains(question.CategoryId))
        {
            errors.Add($"Question '{question.Id}' uses unknown categoryId '{question.CategoryId}'.");
        }

        if (string.IsNullOrWhiteSpace(question.Text))
        {
            errors.Add($"Question '{question.Id}' has empty text.");
        }

        if (!Enum.IsDefined(question.Difficulty))
        {
            errors.Add($"Question '{question.Id}' has invalid difficulty '{question.Difficulty}'.");
        }

        if (question.TimeLimitSeconds < 1)
        {
            errors.Add($"Question '{question.Id}' must have a positive timeLimitSeconds value.");
        }

        if (question.Answers.Count < 2)
        {
            errors.Add($"Question '{question.Id}' must have at least two answers.");
            return;
        }

        var answerIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var answer in question.Answers)
        {
            if (string.IsNullOrWhiteSpace(answer.Id))
            {
                errors.Add($"Question '{question.Id}' has an answer with empty id.");
                continue;
            }

            if (!answerIds.Add(answer.Id))
            {
                errors.Add($"Question '{question.Id}' has duplicated answer id '{answer.Id}'.");
            }

            if (string.IsNullOrWhiteSpace(answer.Text))
            {
                errors.Add($"Question '{question.Id}' has answer '{answer.Id}' with empty text.");
            }
        }

        if (string.IsNullOrWhiteSpace(question.CorrectAnswerId))
        {
            errors.Add($"Question '{question.Id}' has empty correctAnswerId.");
        }
        else if (!answerIds.Contains(question.CorrectAnswerId))
        {
            errors.Add($"Question '{question.Id}' uses unknown correctAnswerId '{question.CorrectAnswerId}'.");
        }
    }
}

public sealed record QuestionBankOptions
{
    public const string SectionName = "QuestionBank";

    public string FilePath { get; init; } = Path.Combine("Data", "question-bank.json");
    public int MinimumQuestionsPerCategory { get; init; } = 8;
}

public sealed record QuestionBankData
{
    public IReadOnlyList<Category> Categories { get; init; } = [];
    public Dictionary<string, IReadOnlyList<QuestionBankQuestion>> Questions { get; init; } = [];
}

public sealed record QuestionBankQuestion
{
    public required string Id { get; init; }
    public required string Text { get; init; }
    public required IReadOnlyList<AnswerDefinition> Answers { get; init; }
    public required string CorrectAnswerId { get; init; }
    public QuestionDifficulty Difficulty { get; init; } = QuestionDifficulty.Medium;
    public int TimeLimitSeconds { get; init; }

    public QuestionDefinition ToQuestionDefinition(string categoryId)
    {
        return new QuestionDefinition
        {
            Id = Id,
            CategoryId = categoryId,
            Text = Text,
            Answers = Answers,
            CorrectAnswerId = CorrectAnswerId,
            Difficulty = Difficulty,
            TimeLimitSeconds = TimeLimitSeconds
        };
    }
}
