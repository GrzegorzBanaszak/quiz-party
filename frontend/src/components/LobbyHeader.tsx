import PartyQuizLogo from "./PartyQuizLogo";
import PlayerScoreBadge from "./PlayerScoreBadge";

function LobbyHeader() {
  return (
    <header className="border-b border-[#464554] bg-[#1f1f27]/70 px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl md:px-10">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between">
        <PartyQuizLogo />
        <PlayerScoreBadge />
      </div>
    </header>
  );
}

export default LobbyHeader;
