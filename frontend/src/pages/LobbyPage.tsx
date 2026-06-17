import LobbyFooter from "../components/LobbyFooter";
import LobbyHeader from "../components/LobbyHeader";
import PlayersSection from "../components/PlayersSection";
import RoomCodePanel from "../components/RoomCodePanel";
import { useGameSession } from "../game/GameSessionContext";

function LobbyPage() {
  const {
    snapshot,
    localPlayer,
    isHost,
    isLoading,
    setReady,
    updateSettings,
    startGame,
  } = useGameSession();

  if (!snapshot) {
    return null;
  }

  const canStart =
    isHost &&
    snapshot.players.length > 0 &&
    snapshot.players.every((player) => player.isHost || player.isReady);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(128,131,255,0.16)_0%,rgba(31,31,39,0.58)_34%,rgba(13,13,21,1)_76%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader
          playerName={localPlayer?.name}
          playerScore={localPlayer?.score}
          playerAvatar={localPlayer?.avatar}
        />

        <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-8 md:px-6">
          <RoomCodePanel roomCode={snapshot.code} />
          <PlayersSection
            players={snapshot.players}
            maxPlayers={snapshot.settings.maxPlayers}
          />
        </section>

        <LobbyFooter
          settings={snapshot.settings}
          isHost={isHost}
          isReady={localPlayer?.isReady ?? false}
          canStart={canStart}
          isBusy={isLoading}
          onReadyChange={(isReady) => void setReady(isReady)}
          onSettingsChange={(settings) => void updateSettings(settings)}
          onStartGame={() => void startGame()}
        />
      </div>
    </main>
  );
}

export default LobbyPage;
