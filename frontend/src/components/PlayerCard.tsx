import type { Player } from "../lib/lobby";

type PlayerCardProps = {
  player: Player;
};

function PlayerCard({ player }: PlayerCardProps) {
  const cardClassName = player.isHost
    ? "border-[#ffd166] shadow-[0_0_26px_rgba(255,209,102,0.22)]"
    : player.isReady
      ? "border-white/10"
      : "border-dashed border-[#908fa0]/30 opacity-80";

  const avatarClassName = player.isHost
    ? "border-2 border-[#ffd166]"
    : player.isReady
      ? "border-2 border-[#4ae176]"
      : "grayscale";

  const badgeClassName = player.isHost
    ? "bg-[#ffd166] text-[#2f2400]"
    : player.isReady
      ? "bg-[#4ae176] text-[#003915]"
      : "bg-[#908fa0] text-[#13131b]";

  const statusClassName = player.isHost
    ? "text-[#ffd166]"
    : player.isReady
      ? "text-[#4ae176]"
      : "text-[#908fa0]";

  const statusIcon = player.isReady ? "check" : "sync";

  return (
    <div
      className={`relative flex min-h-[152px] flex-col items-center gap-3 rounded-[2rem] border bg-[#1f1f27]/70 p-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-[#292932] ${cardClassName}`}
    >
      <div className="relative mt-1">
        <img
          src={player.avatar}
          alt=""
          className={`h-16 w-16 rounded-full bg-[#292932] object-cover ${avatarClassName}`}
        />
        <span
          className={`absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#13131b] ${badgeClassName}`}
        >
          <span
            className={`material-symbols-outlined block text-[12px] ${
              player.isReady ? "" : "animate-spin"
            }`}
            data-icon={statusIcon}
            data-weight={player.isReady ? "fill" : undefined}
            aria-hidden="true"
          >
            {statusIcon}
          </span>
        </span>
      </div>

      <p className="w-full truncate text-center text-sm font-extrabold text-[#e4e1ed]">
        {player.name}
      </p>
      <p
        className={`text-[10px] font-black tracking-[0.08em] uppercase ${statusClassName}`}
      >
        {player.status}
      </p>
    </div>
  );
}

export default PlayerCard;
