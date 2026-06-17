import type { Player } from "../api/gameTypes";
import EmptyPlayerSlot from "./EmptyPlayerSlot";
import PlayerCard from "./PlayerCard";

type PlayersSectionProps = {
  players: Player[];
  maxPlayers: number;
};

function PlayersSection({ players, maxPlayers }: PlayersSectionProps) {
  const emptySlots = Array.from(
    { length: Math.max(maxPlayers - players.length, 0) },
    (_, index) => index,
  );

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-[#4ae176] shadow-[0_0_16px_rgba(74,225,118,0.5)]" />
          <h2 className="text-xl font-extrabold text-[#e4e1ed] sm:text-2xl">
            Waiting for players...
          </h2>
        </div>
        <div className="shrink-0 rounded-full border border-[#464554] bg-[#292932] px-4 py-1.5 text-sm shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
          <span className="font-black text-[#c0c1ff]">{players.length}</span>
          <span className="text-[#c7c4d7]"> / {maxPlayers} joined</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {players.map((player) => (
          <PlayerCard key={player.name} player={player} />
        ))}

        {emptySlots.map((slot) => (
          <EmptyPlayerSlot key={slot} slot={slot} />
        ))}
      </div>
    </div>
  );
}

export default PlayersSection;
