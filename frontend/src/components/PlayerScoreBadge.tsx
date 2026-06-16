import { getAvatarUrl } from "../lib/avatars";

type PlayerScoreBadgeProps = {
  name?: string;
  points?: number;
  avatar?: string;
};

function PlayerScoreBadge({
  name = "Nova",
  points = 1240,
  avatar = getAvatarUrl("Nova", "5aa7ff"),
}: PlayerScoreBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#13131b]/55 py-1.5 pr-4 pl-1.5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl">
      <img
        src={avatar}
        alt=""
        className="h-10 w-10 rounded-full border-2 border-[#c0c1ff] bg-[#292932] object-cover shadow-[0_0_14px_rgba(192,193,255,0.25)]"
      />
      <div className="min-w-0 text-right">
        <p className="max-w-24 truncate text-xs font-bold text-[#c7c4d7]">
          {name}
        </p>
        <p className="text-sm font-extrabold text-[#e4e1ed]">
          {points.toLocaleString("pl-PL")} pkt
        </p>
      </div>
    </div>
  );
}

export default PlayerScoreBadge;
