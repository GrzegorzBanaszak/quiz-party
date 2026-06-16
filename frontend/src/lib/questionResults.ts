import { getAvatarUrl } from "./avatars";

export type RoundLeader = {
  rank: number;
  name: string;
  points: number;
  positionChange: "up" | "down" | "same";
  avatar: string;
};

export const roundLeaders: RoundLeader[] = [
  {
    rank: 1,
    name: "NeonNinja",
    points: 150,
    positionChange: "up",
    avatar: getAvatarUrl("NeonNinja", "ffd166"),
  },
  {
    rank: 2,
    name: "CosmicRay",
    points: 120,
    positionChange: "same",
    avatar: getAvatarUrl("CosmicRay", "b197fc"),
  },
  {
    rank: 3,
    name: "BotMaster",
    points: 110,
    positionChange: "up",
    avatar: getAvatarUrl("BotMaster", "5aa7ff"),
  },
  {
    rank: 4,
    name: "SpellCaster",
    points: 95,
    positionChange: "down",
    avatar: getAvatarUrl("SpellCaster", "ff8fab"),
  },
  {
    rank: 5,
    name: "Zorg",
    points: 80,
    positionChange: "same",
    avatar: getAvatarUrl("Zorg", "69db7c"),
  },
];
