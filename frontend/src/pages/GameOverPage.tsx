import { useNavigate } from "react-router-dom";
import LobbyHeader from "../components/LobbyHeader";
import FinalStandingsList from "../components/game-over/FinalStandingsList";
import GameOverActions from "../components/game-over/GameOverActions";
import GameOverBackground from "../components/game-over/GameOverBackground";
import GameOverHero from "../components/game-over/GameOverHero";
import WinnerCard from "../components/game-over/WinnerCard";
import { useGameSession } from "../game/GameSessionContext";
import { mapLeaderboardToFinalStandings } from "../game/gameUiMappers";

function GameOverPage() {
  const navigate = useNavigate();
  const { snapshot, localPlayer, clearSession } = useGameSession();
  const standings = mapLeaderboardToFinalStandings(
    snapshot?.leaderboard ?? [],
    snapshot?.players ?? [],
  );
  const winner = standings[0];

  function handleLeave() {
    clearSession();
    navigate("/");
  }

  if (!snapshot || !winner) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <GameOverBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader
          playerName={localPlayer?.name}
          playerScore={localPlayer?.score}
          playerAvatar={localPlayer?.avatar}
        />

        <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center gap-10 px-4 py-10 md:px-6">
          <GameOverHero />
          <WinnerCard winner={winner} />
          <FinalStandingsList standings={standings} />
          <GameOverActions onLeave={handleLeave} />
        </section>
      </div>
    </main>
  );
}

export default GameOverPage;
