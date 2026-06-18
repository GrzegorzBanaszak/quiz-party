import { useState } from "react";
import LobbyHeader from "../components/LobbyHeader";
import QuestionBackground from "../components/question/QuestionBackground";

type PowerUpTone = "primary" | "tertiary" | "secondary" | "accent";

type PowerUp = {
  id: string;
  icon: string;
  name: string;
  description: string;
  rarity: string;
  tone: PowerUpTone;
};

const powerUps: PowerUp[] = [
  {
    id: "double-points",
    icon: "star_half",
    name: "Podwojne punkty",
    description:
      "Poprawna odpowiedz w nastepnym pytaniu daje dwa razy wiecej punktow.",
    rarity: "COMMON",
    tone: "primary",
  },
  {
    id: "freeze-time",
    icon: "ac_unit",
    name: "Zamrozenie czasu",
    description:
      "Zatrzymaj licznik na 5 sekund i zyskaj dodatkowy moment na decyzje.",
    rarity: "RARE",
    tone: "tertiary",
  },
  {
    id: "blur-answers",
    icon: "visibility_off",
    name: "Zamglone odpowiedzi",
    description:
      "Utrudnij przeciwnikom start pytania przez chwilowe rozmycie odpowiedzi.",
    rarity: "EPIC",
    tone: "secondary",
  },
  {
    id: "fifty-fifty",
    icon: "exposure_zero",
    name: "Pół na pół",
    description:
      "Usuń dwie błędne odpowiedzi w wybranym pytaniu i zawęź wybór.",
    rarity: "COMMON",
    tone: "accent",
  },
];

const toneClasses: Record<
  PowerUpTone,
  {
    glow: string;
    icon: string;
    iconBox: string;
    text: string;
    wash: string;
  }
> = {
  primary: {
    glow: "shadow-[0_0_22px_rgba(192,193,255,0.28)]",
    icon: "text-[#c0c1ff]",
    iconBox: "border-[#c0c1ff]/30 bg-[#c0c1ff]/15",
    text: "text-[#c0c1ff]",
    wash: "bg-[#c0c1ff]/10",
  },
  tertiary: {
    glow: "shadow-[0_0_22px_rgba(74,225,118,0.24)]",
    icon: "text-[#4ae176]",
    iconBox: "border-[#4ae176]/30 bg-[#4ae176]/15",
    text: "text-[#4ae176]",
    wash: "bg-[#4ae176]/10",
  },
  secondary: {
    glow: "shadow-[0_0_22px_rgba(255,178,183,0.24)]",
    icon: "text-[#ffb2b7]",
    iconBox: "border-[#ffb2b7]/30 bg-[#ffb2b7]/15",
    text: "text-[#ffb2b7]",
    wash: "bg-[#ffb2b7]/10",
  },
  accent: {
    glow: "shadow-[0_0_22px_rgba(90,167,255,0.22)]",
    icon: "text-[#5aa7ff]",
    iconBox: "border-[#5aa7ff]/30 bg-[#5aa7ff]/15",
    text: "text-[#5aa7ff]",
    wash: "bg-[#5aa7ff]/10",
  },
};

function PowerUpSelectionPreviewPage() {
  const [selectedPowerUpId, setSelectedPowerUpId] = useState(powerUps[0].id);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <QuestionBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader playerName="Nova" playerScore={3240} />

        <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-8 md:px-6 md:py-12">
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#292932]/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#ffb4ab] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
              <span
                className="material-symbols-outlined text-base text-[#c0c1ff]"
                data-weight="fill"
              >
                timer
              </span>
              00:12 do wyboru
            </div>

            <h1 className="text-4xl font-black tracking-normal text-[#f3f0ff] md:text-5xl">
              Wybierz zagrywkę
            </h1>
            <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[#c7c4d7] md:text-base">
              Podejrzyj taktyczne opcje, które później będzie można aktywować
              przed pytaniem.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {powerUps.map((powerUp) => {
              const tone = toneClasses[powerUp.tone];
              const isSelected = selectedPowerUpId === powerUp.id;

              return (
                <button
                  key={powerUp.id}
                  type="button"
                  onClick={() => setSelectedPowerUpId(powerUp.id)}
                  className={`group relative flex min-h-[300px] flex-col overflow-hidden rounded-[2rem] border p-6 text-left shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${
                    isSelected
                      ? "border-[#c0c1ff] bg-[#c0c1ff]/10 ring-2 ring-[#c0c1ff]/25"
                      : "border-white/10 bg-[#1f1f27]/78 hover:border-[#c0c1ff]/55 hover:bg-[#292932]/82"
                  }`}
                >
                  <div
                    className={`absolute -right-14 -top-14 h-36 w-36 rounded-full blur-3xl transition ${tone.wash} group-hover:opacity-90`}
                  />

                  <div
                    className={`relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${tone.iconBox} ${tone.glow}`}
                  >
                    <span
                      className={`material-symbols-outlined text-4xl ${tone.icon}`}
                      data-weight="fill"
                    >
                      {powerUp.icon}
                    </span>
                  </div>

                  <h2 className="relative text-2xl font-extrabold tracking-normal text-[#f3f0ff]">
                    {powerUp.name}
                  </h2>
                  <p className="relative mt-3 flex-1 text-sm font-medium leading-6 text-[#c7c4d7]">
                    {powerUp.description}
                  </p>

                  <div
                    className={`relative mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] ${tone.text}`}
                  >
                    <span className="material-symbols-outlined text-base">
                      bolt
                    </span>
                    {powerUp.rarity}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              className="h-16 w-full max-w-sm rounded-[1.5rem] bg-[#c0c1ff] px-8 text-base font-extrabold text-[#1000a9] shadow-[0_0_26px_rgba(192,193,255,0.35)] transition hover:brightness-110 active:scale-[0.98]"
            >
              Potwierdź wybór
            </button>
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#908fa0]">
              Runda 4 / 10 · aktualna pozycja #3
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PowerUpSelectionPreviewPage;
