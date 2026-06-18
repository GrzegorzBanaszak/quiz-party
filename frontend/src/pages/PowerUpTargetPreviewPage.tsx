import { useState } from "react";
import LobbyHeader from "../components/LobbyHeader";
import QuestionBackground from "../components/question/QuestionBackground";
import { getAvatarUrl } from "../lib/avatars";

type TargetPlayer = {
  id: string;
  name: string;
  rank: string;
  rankPosition: number;
  points: number;
  avatar: string;
  isSelf?: boolean;
};

const targetPlayers: TargetPlayer[] = [
  {
    id: "neon-ninja",
    name: "NeonNinja",
    rank: "Gold II",
    rankPosition: 3,
    points: 2450,
    avatar: getAvatarUrl("NeonNinja", "69db7c"),
  },
  {
    id: "cosmic-ray",
    name: "CosmicRay",
    rank: "Quiz Master",
    rankPosition: 1,
    points: 4120,
    avatar: getAvatarUrl("CosmicRay", "b197fc"),
  },
  {
    id: "cyber-queen",
    name: "CyberQueen",
    rank: "Diamond I",
    rankPosition: 2,
    points: 3890,
    avatar: getAvatarUrl("CyberQueen", "5aa7ff"),
  },
  {
    id: "nova",
    name: "Nova",
    rank: "Ty",
    rankPosition: 4,
    points: 3240,
    avatar: getAvatarUrl("Nova", "a67df5"),
    isSelf: true,
  },
  {
    id: "shadow-striker",
    name: "ShadowStriker",
    rank: "Bronze III",
    rankPosition: 6,
    points: 820,
    avatar: getAvatarUrl("ShadowStriker", "ffd166"),
  },
  {
    id: "pixel-vibe",
    name: "PixelVibe",
    rank: "Silver I",
    rankPosition: 5,
    points: 1560,
    avatar: getAvatarUrl("PixelVibe", "ff8fab"),
  },
];

function PowerUpTargetPreviewPage() {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(
    "cosmic-ray",
  );

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <QuestionBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader playerName="Nova" playerScore={3240} />

        <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8">
            <div className="mb-3 flex items-end justify-between gap-4">
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#c0c1ff]">
                Czas na wybór celu
              </span>
              <span className="text-2xl font-black text-[#ffb4ab]">08s</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#34343d]">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-[#c0c1ff] to-[#ffb2b7] shadow-[0_0_18px_rgba(192,193,255,0.25)]" />
            </div>
          </div>

          <div className="mb-10 flex flex-col items-center text-center">
            <h1 className="text-4xl font-black tracking-normal text-[#f3f0ff] md:text-5xl">
              Wybierz cel zagrywki
            </h1>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#ffb2b7]/30 bg-[#b50036]/18 px-4 py-2 text-sm font-bold text-[#ffb2b7]">
              <span
                className="material-symbols-outlined text-base"
                data-weight="fill"
              >
                blur_on
              </span>
              Aktywna zagrywka: Zamglone odpowiedzi
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {targetPlayers.map((player) => {
              const isSelected = selectedTargetId === player.id;
              const isDisabled = player.isSelf;

              return (
                <button
                  key={player.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => setSelectedTargetId(player.id)}
                  className={`group relative flex min-h-[260px] flex-col items-center rounded-[2rem] border p-6 text-center shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl transition duration-300 ${
                    isDisabled
                      ? "cursor-not-allowed border-white/5 bg-[#1b1b23]/70 opacity-45 grayscale"
                      : isSelected
                      ? "border-[#c0c1ff] bg-[#c0c1ff]/10 shadow-[0_0_24px_rgba(192,193,255,0.25)]"
                      : "border-white/10 bg-[#1f1f27]/78 hover:-translate-y-1 hover:border-[#c0c1ff]/60 hover:bg-[#292932]/82"
                  }`}
                >
                  {isDisabled ? (
                    <span className="absolute left-4 top-4 rounded-full bg-[#34343d] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#c7c4d7]">
                      Ty
                    </span>
                  ) : (
                    <span
                      className={`material-symbols-outlined absolute right-4 top-4 transition ${
                        isSelected
                          ? "text-[#c0c1ff] opacity-100"
                          : "text-[#c0c1ff] opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      target
                    </span>
                  )}

                  <div
                    className={`relative mb-4 rounded-full border p-1 transition ${
                      isSelected
                        ? "border-[#c0c1ff] shadow-[0_0_22px_rgba(192,193,255,0.28)]"
                        : "border-[#393841]"
                    }`}
                  >
                    <img
                      src={player.avatar}
                      alt=""
                      className="h-24 w-24 rounded-full bg-[#292932] object-cover"
                    />
                  </div>

                  <h2 className="text-2xl font-extrabold tracking-normal text-[#f3f0ff]">
                    {player.name}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-[#c7c4d7]">
                    {isDisabled
                      ? "Nie możesz wybrać siebie"
                      : `${player.points.toLocaleString("pl-PL")} pkt`}
                  </p>

                  {!isDisabled ? (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#13131b]/55 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.12em] text-[#c0c1ff]">
                      <span className="material-symbols-outlined text-base">
                        leaderboard
                      </span>
                      #{player.rankPosition} w rankingu
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-center gap-3">
            <button
              type="button"
              disabled={!selectedTargetId}
              className="inline-flex h-16 items-center justify-center gap-3 rounded-[1.5rem] bg-[#c0c1ff] px-10 text-base font-extrabold text-[#1000a9] shadow-[0_0_26px_rgba(192,193,255,0.35)] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#34343d] disabled:text-[#908fa0] disabled:shadow-none"
            >
              Potwierdź cel
              <span className="material-symbols-outlined">send</span>
            </button>
            <p className="text-sm font-medium text-[#c7c4d7]">
              Zagrywka wygaśnie, jeśli cel nie zostanie wybrany na czas.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default PowerUpTargetPreviewPage;
