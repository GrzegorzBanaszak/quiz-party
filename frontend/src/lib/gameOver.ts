import { getAvatarUrl } from "./avatars";

export type FinalStanding = {
  rank: number;
  name: string;
  points: number;
  avatar: string;
};

export const finalStandings: FinalStanding[] = [
  {
    rank: 1,
    name: "AlexTheGreat",
    points: 14250,
    avatar: getAvatarUrl("AlexTheGreat", "ff8fab"),
  },
  {
    rank: 2,
    name: "SarahWins",
    points: 12100,
    avatar: getAvatarUrl("SarahWins", "b197fc"),
  },
  {
    rank: 3,
    name: "QuizMaster99",
    points: 10550,
    avatar: getAvatarUrl("QuizMaster99", "5aa7ff"),
  },
  {
    rank: 4,
    name: "Guest_1234",
    points: 8400,
    avatar: getAvatarUrl("Guest_1234", "69db7c"),
  },
];

export function getGameWinner() {
  return finalStandings[0];
}
