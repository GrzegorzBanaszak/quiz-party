import VotingHeader from "../components/voting/VotingHeader";
import {
  getWinningCategory,
  votingCategories,
  type CategoryTone,
} from "../lib/votingCategories";

const toneStyles: Record<
  CategoryTone,
  {
    iconBackground: string;
    iconText: string;
    glow: string;
    badge: string;
  }
> = {
  primary: {
    iconBackground: "bg-[#c0c1ff]/18",
    iconText: "text-[#c0c1ff]",
    glow: "shadow-[0_0_56px_rgba(192,193,255,0.32)]",
    badge: "bg-[#c0c1ff] text-[#1000a9]",
  },
  tertiary: {
    iconBackground: "bg-[#4ae176]/18",
    iconText: "text-[#4ae176]",
    glow: "shadow-[0_0_56px_rgba(74,225,118,0.32)]",
    badge: "bg-[#4ae176] text-[#003915]",
  },
  secondary: {
    iconBackground: "bg-[#ffb2b7]/18",
    iconText: "text-[#ffb2b7]",
    glow: "shadow-[0_0_56px_rgba(255,178,183,0.28)]",
    badge: "bg-[#ffb2b7] text-[#67001b]",
  },
};

function VotingResultPage() {
  const winner = getWinningCategory(votingCategories);
  const totalVotes = votingCategories.reduce(
    (sum, category) => sum + category.votes,
    0,
  );
  const winnerPercentage = Math.round((winner.votes / totalVotes) * 100);
  const styles = toneStyles[winner.tone];

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(74,225,118,0.13)_0%,rgba(31,31,39,0.58)_34%,rgba(13,13,21,1)_76%)]" />
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#292932]/70 to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <VotingHeader />

        <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-4 py-10 md:px-6">
          <div className="mb-8 text-center">
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-extrabold tracking-[0.1em] uppercase ${styles.badge}`}
            >
              Kategoria wybrana
            </span>
            <h1 className="mt-5 text-[32px] leading-tight font-extrabold tracking-normal text-[#e4e1ed] md:text-5xl">
              Zwycięska kategoria
            </h1>
            <p className="mt-3 text-lg font-medium text-[#c7c4d7]">
              Najwięcej graczy zagłosowało na ten temat.
            </p>
          </div>

          <div
            className={`flex w-full max-w-[720px] flex-col items-center rounded-[2rem] border border-[#464554] bg-[#1f1f27]/92 px-6 py-9 text-center ${styles.glow} shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-sm md:px-10`}
          >
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full ${styles.iconBackground} ring-4 ring-white/8`}
            >
              <span
                className={`material-symbols-outlined text-6xl ${styles.iconText}`}
                data-weight="fill"
                aria-hidden="true"
              >
                {winner.icon}
              </span>
            </div>

            <h2 className="mt-6 text-[40px] leading-tight font-extrabold tracking-normal text-[#e4e1ed] md:text-6xl">
              {winner.title}
            </h2>
            <p className="mt-3 max-w-[420px] text-lg leading-relaxed font-medium text-[#c7c4d7]">
              {winner.description}
            </p>

            <div className="mt-8 grid w-full max-w-[440px] grid-cols-2 gap-3">
              <div className="rounded-[1.25rem] border border-white/8 bg-[#13131b]/70 p-4">
                <span className="block text-xs font-bold tracking-[0.1em] text-[#908fa0] uppercase">
                  Głosy
                </span>
                <span className="mt-1 block text-3xl font-extrabold text-[#e4e1ed]">
                  {winner.votes}
                </span>
              </div>
              <div className="rounded-[1.25rem] border border-white/8 bg-[#13131b]/70 p-4">
                <span className="block text-xs font-bold tracking-[0.1em] text-[#908fa0] uppercase">
                  Wynik
                </span>
                <span className="mt-1 block text-3xl font-extrabold text-[#e4e1ed]">
                  {winnerPercentage}%
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 text-[#c7c4d7]">
              <span className="material-symbols-outlined animate-pulse" aria-hidden="true">
                hourglass_top
              </span>
              <span className="text-base font-medium md:text-lg">
                Przygotowujemy pytania z tej kategorii...
              </span>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}

export default VotingResultPage;
