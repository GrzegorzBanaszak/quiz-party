import { Link } from "react-router-dom";
import LobbySetting from "./LobbySetting";

function LobbyFooter() {
  return (
    <footer className="mt-auto border-t border-[#464554] bg-[#1f1f27]/70 p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl md:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          <LobbySetting icon="quiz" label="15 Questions" tone="secondary" />
          <LobbySetting icon="timer" label="15s / Question" tone="tertiary" />
        </div>

        <Link
          to="/voting"
          className="flex h-14 w-full min-w-[200px] items-center justify-center gap-3 rounded-full bg-[#c0c1ff] px-8 text-lg font-black text-[#1000a9] shadow-lg shadow-[#8083ff]/20 transition hover:scale-105 hover:bg-[#d2d2ff] focus:ring-4 focus:ring-[#c0c1ff]/35 focus:outline-none active:scale-95 md:w-auto"
        >
          Start Game
          <span
            className="material-symbols-outlined"
            data-icon="play_arrow"
            data-weight="fill"
            aria-hidden="true"
          >
            play_arrow
          </span>
        </Link>
      </div>
    </footer>
  );
}

export default LobbyFooter;
