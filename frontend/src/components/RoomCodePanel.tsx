import { useState } from "react";
import { roomCode } from "../lib/lobby";

function RoomCodePanel() {
  const [copied, setCopied] = useState(false);

  async function handleCopyRoomCode() {
    await navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mx-auto mb-12 w-full max-w-md">
      <p className="mb-3 text-center text-sm font-medium tracking-[0.18em] text-[#c7c4d7] uppercase">
        Join the Battle
      </p>

      <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#8083ff] to-[#494bd6] p-8 shadow-[0_18px_44px_rgba(128,131,255,0.34)]">
        <div className="absolute -top-14 -right-12 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
        <h1 className="relative text-[64px] leading-none font-extrabold tracking-[0.22em] text-white drop-shadow-lg">
          {roomCode}
        </h1>
        <button
          type="button"
          onClick={handleCopyRoomCode}
          className={`relative flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-extrabold text-white backdrop-blur-md transition focus:ring-4 focus:ring-white/25 focus:outline-none ${
            copied ? "bg-[#4ae176]/80" : "bg-white/20 hover:bg-white/30"
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            data-icon="content_copy"
          >
            content_copy
          </span>
          <span>{copied ? "Copied" : "Copy Room Code"}</span>
        </button>
      </div>
    </div>
  );
}

export default RoomCodePanel;
