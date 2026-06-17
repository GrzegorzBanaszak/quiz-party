using PartyQuiz.Api.Domain;

namespace PartyQuiz.Api.Services;

public sealed class SeededQuestionBank : IQuestionBank
{
    private readonly IReadOnlyList<Category> _categories =
    [
        new()
        {
            Id = "history",
            Name = "Historia",
            Description = "Dawne imperia i wielkie wydarzenia"
        },
        new()
        {
            Id = "science",
            Name = "Nauka",
            Description = "Kosmos, biologia i fizyka"
        },
        new()
        {
            Id = "pop-culture",
            Name = "Popkultura",
            Description = "Filmy, muzyka i viralowe trendy"
        },
        new()
        {
            Id = "geography",
            Name = "Geografia",
            Description = "Panstwa, miasta i kontynenty"
        }
    ];

    private readonly IReadOnlyList<QuestionDefinition> _questions =
    [
        Question("history-1", "history", "Ktore wydarzenie rozpoczelo II wojne swiatowa?", "answer-b",
            ("answer-a", "A", "Atak Japonii na Pearl Harbor"),
            ("answer-b", "B", "Atak Niemiec na Polske"),
            ("answer-c", "C", "Ladowanie w Normandii"),
            ("answer-d", "D", "Bitwa o Anglie")),
        Question("history-2", "history", "Kto byl pierwszym krolem Polski?", "answer-a",
            ("answer-a", "A", "Boleslaw Chrobry"),
            ("answer-b", "B", "Mieszko II"),
            ("answer-c", "C", "Kazimierz Wielki"),
            ("answer-d", "D", "Wladyslaw Lokietek")),
        Question("history-3", "history", "W ktorym roku upadl mur berlinski?", "answer-c",
            ("answer-a", "A", "1979"),
            ("answer-b", "B", "1985"),
            ("answer-c", "C", "1989"),
            ("answer-d", "D", "1991")),
        Question("history-4", "history", "Ktore miasto bylo stolica Cesarstwa Bizantyjskiego?", "answer-d",
            ("answer-a", "A", "Ateny"),
            ("answer-b", "B", "Rzym"),
            ("answer-c", "C", "Aleksandria"),
            ("answer-d", "D", "Konstantynopol")),
        Question("history-5", "history", "Kto dowodzil wyprawa, ktora jako pierwsza oplynela Ziemie?", "answer-b",
            ("answer-a", "A", "Krzysztof Kolumb"),
            ("answer-b", "B", "Ferdynand Magellan"),
            ("answer-c", "C", "James Cook"),
            ("answer-d", "D", "Vasco da Gama")),

        Question("science-1", "science", "Ktora planeta jest znana jako Czerwona Planeta?", "answer-b",
            ("answer-a", "A", "Wenus"),
            ("answer-b", "B", "Mars"),
            ("answer-c", "C", "Jowisz"),
            ("answer-d", "D", "Saturn")),
        Question("science-2", "science", "Jaki pierwiastek ma symbol chemiczny O?", "answer-a",
            ("answer-a", "A", "Tlen"),
            ("answer-b", "B", "Zloto"),
            ("answer-c", "C", "Osm"),
            ("answer-d", "D", "Wegiel")),
        Question("science-3", "science", "Ile chromosomow ma zwykle komorka somatyczna czlowieka?", "answer-c",
            ("answer-a", "A", "23"),
            ("answer-b", "B", "44"),
            ("answer-c", "C", "46"),
            ("answer-d", "D", "48")),
        Question("science-4", "science", "Co mierzy skala Richtera?", "answer-d",
            ("answer-a", "A", "Predkosc wiatru"),
            ("answer-b", "B", "Gestosc cieczy"),
            ("answer-c", "C", "Jasnosc gwiazd"),
            ("answer-d", "D", "Magnitude trzesienia ziemi")),
        Question("science-5", "science", "Ktora czastka ma ladunek ujemny?", "answer-a",
            ("answer-a", "A", "Elektron"),
            ("answer-b", "B", "Proton"),
            ("answer-c", "C", "Neutron"),
            ("answer-d", "D", "Foton")),

        Question("pop-culture-1", "pop-culture", "Ktory film rozpoczyna sage filmowa Star Wars wedlug daty premiery?", "answer-a",
            ("answer-a", "A", "Nowa nadzieja"),
            ("answer-b", "B", "Mroczne widmo"),
            ("answer-c", "C", "Imperium kontratakuje"),
            ("answer-d", "D", "Powrot Jedi")),
        Question("pop-culture-2", "pop-culture", "Ktory zespol nagral album Abbey Road?", "answer-c",
            ("answer-a", "A", "Queen"),
            ("answer-b", "B", "The Rolling Stones"),
            ("answer-c", "C", "The Beatles"),
            ("answer-d", "D", "Pink Floyd")),
        Question("pop-culture-3", "pop-culture", "Jak nazywa sie szkola magii Harry'ego Pottera?", "answer-b",
            ("answer-a", "A", "Beauxbatons"),
            ("answer-b", "B", "Hogwart"),
            ("answer-c", "C", "Durmstrang"),
            ("answer-d", "D", "Ilvermorny")),
        Question("pop-culture-4", "pop-culture", "Ktora gra spopularyzowala tryb battle royale na masowa skale w 2017 roku?", "answer-d",
            ("answer-a", "A", "Minecraft"),
            ("answer-b", "B", "League of Legends"),
            ("answer-c", "C", "Counter-Strike"),
            ("answer-d", "D", "Fortnite")),
        Question("pop-culture-5", "pop-culture", "Ktory serial zaczyna sie od zagubienia bohaterow na wyspie?", "answer-a",
            ("answer-a", "A", "Lost"),
            ("answer-b", "B", "Breaking Bad"),
            ("answer-c", "C", "The Office"),
            ("answer-d", "D", "Sherlock")),

        Question("geography-1", "geography", "Jaka jest stolica Kanady?", "answer-c",
            ("answer-a", "A", "Toronto"),
            ("answer-b", "B", "Montreal"),
            ("answer-c", "C", "Ottawa"),
            ("answer-d", "D", "Vancouver")),
        Question("geography-2", "geography", "Ktory kontynent ma najwieksza powierzchnie?", "answer-a",
            ("answer-a", "A", "Azja"),
            ("answer-b", "B", "Afryka"),
            ("answer-c", "C", "Europa"),
            ("answer-d", "D", "Ameryka Polnocna")),
        Question("geography-3", "geography", "Przez ktore miasto przeplywa Sekwana?", "answer-d",
            ("answer-a", "A", "Berlin"),
            ("answer-b", "B", "Madryt"),
            ("answer-c", "C", "Rzym"),
            ("answer-d", "D", "Paryz")),
        Question("geography-4", "geography", "Ktore panstwo ma najdluzsza linie brzegowa?", "answer-b",
            ("answer-a", "A", "Australia"),
            ("answer-b", "B", "Kanada"),
            ("answer-c", "C", "Brazylia"),
            ("answer-d", "D", "Indie")),
        Question("geography-5", "geography", "Najwyzszy szczyt swiata to:", "answer-c",
            ("answer-a", "A", "K2"),
            ("answer-b", "B", "Kangchenjunga"),
            ("answer-c", "C", "Mount Everest"),
            ("answer-d", "D", "Lhotse"))
    ];

    public IReadOnlyList<Category> Categories => _categories;

    public Category? GetCategory(string categoryId)
    {
        return _categories.FirstOrDefault(category =>
            string.Equals(category.Id, categoryId, StringComparison.OrdinalIgnoreCase));
    }

    public IReadOnlyList<QuestionDefinition> GetQuestions(string categoryId)
    {
        return _questions
            .Where(question => string.Equals(question.CategoryId, categoryId, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public QuestionDefinition? GetQuestion(string questionId)
    {
        return _questions.FirstOrDefault(question =>
            string.Equals(question.Id, questionId, StringComparison.OrdinalIgnoreCase));
    }

    private static QuestionDefinition Question(
        string id,
        string categoryId,
        string text,
        string correctAnswerId,
        params (string Id, string Letter, string Text)[] answers)
    {
        return new QuestionDefinition
        {
            Id = id,
            CategoryId = categoryId,
            Text = text,
            CorrectAnswerId = correctAnswerId,
            TimeLimitSeconds = 12,
            Answers = answers
                .Select(answer => new Answer
                {
                    Id = answer.Id,
                    Letter = answer.Letter,
                    Text = answer.Text
                })
                .ToList()
        };
    }
}
