import LobbyFooter from "../components/LobbyFooter";
import LobbyHeader from "../components/LobbyHeader";
import PlayersSection from "../components/PlayersSection";
import RoomCodePanel from "../components/RoomCodePanel";

function LobbyPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(128,131,255,0.16)_0%,rgba(31,31,39,0.58)_34%,rgba(13,13,21,1)_76%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader />

        <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 py-8 md:px-6">
          <RoomCodePanel />
          <PlayersSection />
        </section>

        <LobbyFooter />
      </div>
    </main>
  );
}

export default LobbyPage;
