# Party Quiz API

## Cel API

API odpowiada za prowadzenie rozgrywki Party Quiz od utworzenia pokoju do pokazania zwycięzcy. Backend ma przechowywać stan pokoju, graczy, ustawień hosta, wyboru kategorii, pytań, odpowiedzi, punktacji oraz tabeli wyników.

MVP nie zakłada logowania użytkowników. Gracz jest identyfikowany w ramach pokoju przez `playerId`, a host przez `hostPlayerId` przypisany podczas tworzenia pokoju.

Aktywne pokoje i bieżący stan gry powinny być przechowywane w Redis. Dzięki temu API może szybko odczytywać i aktualizować stan rozgrywki, a w przyszłości działać na więcej niż jednej instancji backendu.

Komunikacja dzieli się na dwie warstwy:

- REST zmienia stan gry albo zwraca aktualny snapshot pokoju.
- SignalR rozgłasza zdarzenia live do klientów podłączonych do danego pokoju.

## Przepływ rozgrywki

1. Host tworzy pokój.
2. API generuje krótki kod pokoju, np. `A7K2`.
3. Inni gracze dołączają do pokoju po kodzie.
4. Host ustawia liczbę pytań oraz liczbę kategorii, czyli rund.
5. Gracze ustawiają gotowość do rozgrywki.
6. Host startuje grę, a pokój przechodzi do pierwszego wyboru kategorii.
7. Gracze wybierają albo głosują na kategorię rundy.
8. API wybiera kategorię i publikuje pierwsze pytanie.
9. Gracze odpowiadają na pytanie w limicie czasu.
10. Po pytaniu API publikuje poprawną odpowiedź, punkty zdobyte w pytaniu, aktualny ranking oraz informacje o zmianie miejsca w tabeli.
11. Gra przechodzi do kolejnego pytania albo kolejnego wyboru kategorii.
12. Po ostatnim pytaniu API kończy grę i publikuje finalną tabelę oraz zwycięzcę.

## Role

### Host

Host jest graczem, który utworzył pokój. Może:

- zmieniać ustawienia pokoju w stanie `Lobby`,
- rozpocząć grę, gdy warunki startu są spełnione,
- uczestniczyć w rozgrywce jak pozostali gracze.

Host nie powinien móc zmieniać liczby pytań ani rund po rozpoczęciu gry.

### Player

Player to każdy gracz dołączony do pokoju. Może:

- dołączyć do pokoju po kodzie,
- ustawić nick i avatar,
- oznaczyć gotowość w lobby,
- głosować na kategorię albo wybrać kategorię zgodnie z aktualnymi zasadami rundy,
- odpowiadać na pytania,
- obserwować wyniki po pytaniach i finalny ranking.

## Stany pokoju

| Stan                | Znaczenie                                                                              |
| ------------------- | -------------------------------------------------------------------------------------- |
| `Lobby`             | Pokój został utworzony, gracze dołączają, host ustawia grę, gracze ustawiają gotowość. |
| `CategorySelection` | Trwa wybór albo głosowanie na kategorię dla aktualnej rundy.                           |
| `Question`          | Trwa odpowiadanie na aktualne pytanie.                                                 |
| `QuestionResult`    | API pokazuje poprawną odpowiedź, punkty i aktualny ranking po pytaniu.                 |
| `Finished`          | Gra jest zakończona, widoczna jest finalna tabela i zwycięzca.                         |

Dozwolone przejścia:

- `Lobby` -> `CategorySelection`
- `CategorySelection` -> `Question`
- `Question` -> `QuestionResult`
- `QuestionResult` -> `Question`
- `QuestionResult` -> `CategorySelection`
- `QuestionResult` -> `Finished`

## Redis

Redis jest głównym magazynem aktywnego stanu rozgrywki w MVP. Powinien przechowywać dane potrzebne do obsługi pokoju w czasie rzeczywistym:

- snapshot pokoju,
- listę graczy,
- ustawienia gry,
- aktualny stan pokoju,
- aktualną rundę i pytanie,
- odpowiedzi graczy dla bieżącego pytania,
- punktację i ranking,
- głosy oddane na kategorie.

Redis nie powinien być w MVP traktowany jako trwała baza historii rozgrywek. Dane pokoju mogą wygasać po zakończeniu gry albo po dłuższej bezczynności.

### Proponowane klucze

| Klucz                              | Zawartość                                      |
| ---------------------------------- | ---------------------------------------------- |
| `room:{code}`                      | Snapshot pokoju jako JSON.                     |
| `room:{code}:players`              | Lista albo hash graczy w pokoju.               |
| `room:{code}:answers:{questionId}` | Odpowiedzi graczy na aktualne pytanie.         |
| `room:{code}:category-votes`       | Głosy oddane na kategorie w aktualnej rundzie. |
| `room:{code}:leaderboard`          | Aktualny ranking graczy.                       |

Przykład dla pokoju `A7K2`:

```text
room:A7K2
room:A7K2:players
room:A7K2:answers:question-1
room:A7K2:category-votes
room:A7K2:leaderboard
```

### Czas życia danych

- Aktywny pokój powinien mieć odświeżany TTL po każdej istotnej akcji gracza albo hosta.
- Po zakończeniu gry dane pokoju mogą pozostać przez krótki czas, np. 15-60 minut, żeby gracze mogli zobaczyć ekran końcowy po odświeżeniu strony.
- Pokoje porzucone w stanie `Lobby` powinny wygasać automatycznie.

### Konfiguracja

Połączenie do Redis powinno być konfigurowane przez `appsettings.json` albo zmienne środowiskowe.

Przykładowa konfiguracja:

```json
{
  "Redis": {
    "ConnectionString": "localhost:6379",
    "InstanceName": "party-quiz"
  }
}
```

W środowisku developerskim Redis może działać lokalnie, np. w Dockerze. W środowisku produkcyjnym connection string powinien pochodzić ze zmiennej środowiskowej albo secret managera.

## Minimalne modele danych

### Room

```json
{
  "code": "A7K2",
  "state": "Lobby",
  "hostPlayerId": "player-host-id",
  "settings": {},
  "players": [],
  "currentRound": 0,
  "currentQuestionIndex": 0,
  "leaderboard": []
}
```

### Player

```json
{
  "id": "player-id",
  "name": "QuizMaster",
  "avatar": "avatar-url-or-key",
  "isHost": false,
  "isReady": true,
  "score": 1200,
  "rank": 2
}
```

### GameSettings

```json
{
  "questionsPerRound": 5,
  "roundsCount": 3,
  "answerTimeSeconds": 12,
  "maxPlayers": 12
}
```

`questionsPerRound` określa liczbę pytań w jednej kategorii. `roundsCount` określa liczbę kategorii/rund w całej grze.

### Category

```json
{
  "id": "history",
  "name": "Historia",
  "description": "Dawne imperia i wielkie wydarzenia"
}
```

### Question

```json
{
  "id": "question-id",
  "categoryId": "history",
  "text": "Które wydarzenie rozpoczęło II wojnę światową?",
  "answers": [],
  "timeLimitSeconds": 12
}
```

Pytanie wysyłane do graczy w stanie `Question` nie powinno zawierać `correctAnswerId`.

### Answer

```json
{
  "id": "answer-b",
  "letter": "B",
  "text": "Atak Niemiec na Polskę"
}
```

### ScoreEntry

```json
{
  "playerId": "player-id",
  "playerName": "QuizMaster",
  "points": 1200,
  "rank": 2,
  "previousRank": 3,
  "rankChange": 1
}
```

### QuestionResult

```json
{
  "questionId": "question-id",
  "correctAnswerId": "answer-b",
  "correctAnswerText": "Atak Niemiec na Polskę",
  "playerResults": [
    {
      "playerId": "player-id",
      "selectedAnswerId": "answer-b",
      "isCorrect": true,
      "pointsGained": 333,
      "totalPoints": 1200,
      "rank": 2,
      "previousRank": 3,
      "rankChange": 1
    }
  ],
  "leaderboard": []
}
```

## REST API

REST służy do wykonywania komend i pobierania aktualnego stanu pokoju. Każdy endpoint operujący na pokoju powinien walidować, czy pokój istnieje i czy jego aktualny stan pozwala wykonać daną akcję.

### `POST /api/rooms`

Tworzy pokój i hosta.

Przykładowe body:

```json
{
  "playerName": "Host",
  "avatar": "avatar-key"
}
```

Przykładowa odpowiedź:

```json
{
  "roomCode": "A7K2",
  "playerId": "player-host-id",
  "state": "Lobby"
}
```

### `POST /api/rooms/{code}/players`

Dołącza gracza do pokoju po kodzie.

Przykładowe body:

```json
{
  "playerName": "QuizMaster",
  "avatar": "avatar-key"
}
```

Po udanym dołączeniu API rozgłasza `PlayerJoined`.

### `PATCH /api/rooms/{code}/settings`

Zmienia ustawienia pokoju. Endpoint jest dostępny tylko dla hosta i tylko w stanie `Lobby`.

Przykładowe body:

```json
{
  "hostPlayerId": "player-host-id",
  "questionsPerRound": 5,
  "roundsCount": 3
}
```

Po zmianie API rozgłasza `RoomSettingsChanged`.

### `PATCH /api/rooms/{code}/players/{playerId}/ready`

Zmienia gotowość gracza.

Przykładowe body:

```json
{
  "isReady": true
}
```

Po zmianie API rozgłasza `PlayerReadyChanged`.

### `POST /api/rooms/{code}/start`

Startuje grę. Endpoint jest dostępny tylko dla hosta.

Minimalne warunki startu:

- pokój jest w stanie `Lobby`,
- pokój ma hosta,
- w pokoju jest co najmniej jeden gracz,
- ustawienia gry są poprawne,
- gracze wymagani do startu mają ustawioną gotowość.

Po starcie API rozgłasza `GameStarted`, a następnie `CategorySelectionStarted`.

### `POST /api/rooms/{code}/category-votes`

Oddaje głos na kategorię w stanie `CategorySelection`.

Przykładowe body:

```json
{
  "playerId": "player-id",
  "categoryId": "history"
}
```

Po głosie API rozgłasza `CategoryVoteUpdated`. Po zakończeniu wyboru kategorii API przechodzi do stanu `Question` i rozgłasza `QuestionStarted`.

### `POST /api/rooms/{code}/answers`

Zapisuje odpowiedź gracza na aktualne pytanie w stanie `Question`.

Przykładowe body:

```json
{
  "playerId": "player-id",
  "questionId": "question-id",
  "answerId": "answer-b",
  "answeredAtMs": 7350
}
```

`answeredAtMs` oznacza czas odpowiedzi liczony od startu pytania. API używa tej wartości tylko do walidacji, czy odpowiedź mieści się w limicie czasu.

Po zapisaniu odpowiedzi API rozgłasza `AnswerSubmitted` bez ujawniania odpowiedzi gracza innym klientom, chyba że UI będzie tego wymagało.

### `GET /api/rooms/{code}`

Zwraca aktualny snapshot pokoju. Endpoint jest przydatny przy odświeżeniu strony, ponownym połączeniu klienta albo dołączeniu obserwatora.

## SignalR

SignalR służy do zdarzeń live. Klient po połączeniu powinien dołączyć do grupy pokoju na podstawie kodu pokoju. Wszystkie zdarzenia dotyczące pokoju powinny być wysyłane tylko do klientów w tej grupie.

Proponowany hub:

```text
/hubs/game
```

Zdarzenia wysyłane przez API:

| Zdarzenie                  | Kiedy jest wysyłane                            |
| -------------------------- | ---------------------------------------------- |
| `PlayerJoined`             | Po dołączeniu gracza do pokoju.                |
| `PlayerReadyChanged`       | Po zmianie gotowości gracza.                   |
| `RoomSettingsChanged`      | Po zmianie ustawień przez hosta.               |
| `GameStarted`              | Po starcie gry.                                |
| `CategorySelectionStarted` | Gdy rozpoczyna się wybór kategorii.            |
| `CategoryVoteUpdated`      | Po głosie gracza na kategorię.                 |
| `QuestionStarted`          | Gdy rozpoczyna się pytanie.                    |
| `AnswerSubmitted`          | Po przyjęciu odpowiedzi gracza.                |
| `QuestionResultPublished`  | Po zakończeniu pytania i przeliczeniu punktów. |
| `LeaderboardUpdated`       | Gdy ranking został przeliczony.                |
| `GameFinished`             | Po zakończeniu całej rozgrywki.                |

## Zasady gry i punktacji

- Kod pokoju ma być krótki, czytelny i unikalny wśród aktywnych pokoi.
- Kod pokoju powinien unikać znaków łatwych do pomylenia, np. `O` i `0`.
- Host może zmieniać ustawienia tylko w stanie `Lobby`.
- Pytanie wysłane do klienta nie może ujawniać poprawnej odpowiedzi przed stanem `QuestionResult`.
- Odpowiedź gracza powinna być przyjęta tylko raz dla danego pytania.
- Brak odpowiedzi w limicie czasu oznacza `0` punktów za pytanie.
- Każde pytanie ma pulę punktów bazowych. W MVP pula wynosi `1000` punktów.
- Pula punktów za pytanie jest dzielona równo między graczy, którzy odpowiedzieli poprawnie.
- Jeśli nikt nie odpowie poprawnie, nikt nie dostaje punktów za pytanie.
- Po każdym pytaniu API publikuje poprawną odpowiedź, punkty zdobyte w pytaniu, aktualny ranking oraz zmianę pozycji w tabeli.
- Ranking powinien być sortowany malejąco po liczbie punktów.
- Remisy mogą być rozstrzygane później; MVP może dopuszczać ten sam wynik punktowy bez dodatkowego tie-breakera.

## Przyszłe rozszerzenia

W przyszłości API powinno pozwolić na dodanie zagrywek inspirowanych grą "Wiedza to potęga". Nie są one częścią MVP, ale model gry powinien zostawić na nie miejsce.

Przykłady przyszłych mechanik:

- zagrywki utrudniające odpowiedź innemu graczowi,
- bonusy punktowe,
- modyfikatory czasu,
- efekty aktywne tylko dla jednego pytania,
- historia użytych zagrywek w rundzie.

Rozszerzenia tego typu nie powinny zmieniać podstawowego flow REST + SignalR. Powinny być dodane jako osobne komendy i zdarzenia realtime.

## Wytyczne implementacyjne

- Logika gry powinna być trzymana po stronie backendu.
- Redis powinien być źródłem prawdy dla aktywnych pokoi i bieżącego stanu rozgrywki.
- Aktualizacje stanu w Redis powinny być atomowe tam, gdzie istnieje ryzyko równoczesnych odpowiedzi albo głosów.
- Frontend nie powinien samodzielnie wyliczać punktów ani wybierać zwycięzcy.
- Endpointy powinny zwracać czytelne błędy walidacji, np. pokój nie istnieje, gracz nie jest hostem, akcja niedozwolona w aktualnym stanie.
- Nazwy stanów, endpointów i zdarzeń SignalR powinny pozostać spójne w backendzie i frontendzie.
- Snapshot z `GET /api/rooms/{code}` powinien wystarczyć klientowi do odtworzenia aktualnego widoku po odświeżeniu strony.

## Testy akceptacyjne README

- Flow rozgrywki obejmuje tworzenie pokoju, dołączanie graczy, gotowość, wybór kategorii, pytania, wyniki po pytaniach i koniec gry.
- Dokument rozróżnia role REST i SignalR.
- Dokument opisuje rolę Redis jako magazynu aktywnego stanu gry.
- Nazwy stanów, endpointów i zdarzeń są spójne w całym dokumencie.
- `dotnet build api\api.csproj` przechodzi po dodaniu dokumentacji.
