import { getAvatarUrl } from "./avatars";

export type RoundLeader = {
  rank: number;
  name: string;
  pointsGained: number;
  totalPoints: number;
  positionChange: "up" | "down" | "same";
  avatar: string;
};

export const roundLeaders: RoundLeader[] = [
  {
    rank: 1,
    name: "NeonNinja",
    pointsGained: 150,
    totalPoints: 150,
    positionChange: "up",
    avatar: getAvatarUrl("NeonNinja", "ffd166"),
  },
  {
    rank: 2,
    name: "CosmicRay",
    pointsGained: 120,
    totalPoints: 120,
    positionChange: "same",
    avatar: getAvatarUrl("CosmicRay", "b197fc"),
  },
  {
    rank: 3,
    name: "BotMaster",
    pointsGained: 110,
    totalPoints: 110,
    positionChange: "up",
    avatar: getAvatarUrl("BotMaster", "5aa7ff"),
  },
  {
    rank: 4,
    name: "SpellCaster",
    pointsGained: 95,
    totalPoints: 95,
    positionChange: "down",
    avatar: getAvatarUrl("SpellCaster", "ff8fab"),
  },
  {
    rank: 5,
    name: "Zorg",
    pointsGained: 80,
    totalPoints: 80,
    positionChange: "same",
    avatar: getAvatarUrl("Zorg", "69db7c"),
  },
];
