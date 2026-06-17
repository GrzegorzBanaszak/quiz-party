import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import ConnectionStatusBanner from "../components/ConnectionStatusBanner";
import { useGameSession } from "../game/GameSessionContext";
import GameOverPage from "./GameOverPage";
import LobbyPage from "./LobbyPage";
import QuestionPage from "./QuestionPage";
import QuestionResultPage from "./QuestionResultPage";
import VotingPage from "./VotingPage";

function GameRoomPage() {
  const { roomCode } = useParams();
  const { snapshot, isLoading, error, loadRoom } = useGameSession();

  useEffect(() => {
    if (roomCode) {
      void loadRoom(roomCode);
    }
  }, [loadRoom, roomCode]);

  if (!roomCode) {
    return <Navigate to="/" replace />;
  }

  if (isLoading && !snapshot) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#13131b] px-6 text-center text-[#e4e1ed]">
        <p className="text-xl font-extrabold">Ladowanie pokoju...</p>
      </main>
    );
  }

  if (!snapshot) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#13131b] px-6 text-center text-[#e4e1ed]">
        <div className="max-w-md">
          <h1 className="text-3xl font-black">Nie znaleziono pokoju</h1>
          <p className="mt-3 text-[#c7c4d7]">
            {error ?? "Pokoj wygasl albo kod jest nieprawidlowy."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <ConnectionStatusBanner />
      {snapshot.state === "Lobby" ? <LobbyPage /> : null}
      {snapshot.state === "CategorySelection" ? <VotingPage /> : null}
      {snapshot.state === "Question" ? <QuestionPage /> : null}
      {snapshot.state === "QuestionResult" ? <QuestionResultPage /> : null}
      {snapshot.state === "Finished" ? <GameOverPage /> : null}
    </>
  );
}

export default GameRoomPage;
