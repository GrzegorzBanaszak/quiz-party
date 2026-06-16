import LobbyHeader from "../components/LobbyHeader";
import FinalStandingsList from "../components/game-over/FinalStandingsList";
import GameOverActions from "../components/game-over/GameOverActions";
import GameOverBackground from "../components/game-over/GameOverBackground";
import GameOverHero from "../components/game-over/GameOverHero";
import WinnerCard from "../components/game-over/WinnerCard";
import { finalStandings, getGameWinner } from "../lib/gameOver";

function GameOverPage() {
  const winner = getGameWinner();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <GameOverBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader />

        <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center gap-10 px-4 py-10 md:px-6">
          <GameOverHero />
          <WinnerCard winner={winner} />
          <FinalStandingsList standings={finalStandings} />
          <GameOverActions />
        </section>
      </div>
    </main>
  );
}

export default GameOverPage;
