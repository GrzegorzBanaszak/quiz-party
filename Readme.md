# Party quiz

## 1. Główna koncepcja

Gra działa w przeglądarce. Jeden użytkownik tworzy pokój jako host, a pozostali gracze dołączają przez kod pokoju.

Przykład:

Host tworzy grę.
System generuje kod pokoju, np. A7K2.
Gracze wchodzą na stronę i wpisują kod.
Po dołączeniu wszyscy widzą lobby.
Host rozpoczyna grę.
Gracze odpowiadają na pytania w czasie rzeczywistym.
System liczy punkty.
Po kilku rundach pokazuje ranking końcowy.

## 2. Najważniejsze funkcje MVP

Na start zrobiłbym prostą wersję, bez logowania.

Funkcje podstawowe:

- tworzenie pokoju gry,
- dołączanie do pokoju po kodzie,
- lista graczy w lobby,
- wybór nicku i avatara,
- start gry przez hosta,
- pytania z 4 odpowiedziami,
- limit czasu na odpowiedź,
- liczenie punktów,
- ranking po każdej rundzie,
- ekran końcowy z wynikami.

Funkcje późniejsze:

- kategorie pytań,
- własne zestawy pytań,
- przeszkadzajki/sabotowanie innych graczy,
- tryb drużynowy,
- animacje i efekty,

## 3. Frontend

Frontend znajduje się w katalogu `frontend` i jest zbudowany w React + Vite + Tailwind CSS.

Główne elementy:

```text
frontend/
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── AppHeader.tsx
    │   ├── AvatarPicker.tsx
    │   └── PlayerForm.tsx
    ├── lib/
    │   └── avatars.ts
    └── pages/
        ├── CreateGamePage.tsx
        ├── HomePage.tsx
        ├── JoinGamePage.tsx
        └── LobbyPage.tsx
```

Opis struktury:

- `src/App.tsx` - konfiguracja tras aplikacji.
- `src/main.tsx` - punkt wejścia Reacta i podłączenie routera.
- `src/pages` - widoki stron, np. ekran główny, tworzenie gry i dołączanie do gry.
- `src/components` - współdzielone komponenty UI używane przez strony.
- `src/lib` - pomocnicza logika i dane, np. konfiguracja avatarów.
- `src/index.css` - globalne style, import Tailwind CSS i animacje.
