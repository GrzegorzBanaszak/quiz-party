import { getAvatarUrl } from "./avatars";

export const roomCode = "A7K2";

export const players = [
  {
    name: "Alex Johnson",
    avatar: getAvatarUrl("Alex", "a67df5"),
    status: "Host",
    isReady: true,
    isHost: true,
  },
  {
    name: "SpeedyQuizzer",
    avatar: getAvatarUrl("Nova", "69db7c"),
    status: "Ready",
    isReady: true,
    isHost: false,
  },
  {
    name: "TriviaMaster",
    avatar: getAvatarUrl("Pixel", "ffd166"),
    status: "Ready",
    isReady: true,
    isHost: false,
  },
  {
    name: "Brainiac",
    avatar: getAvatarUrl("Orbit", "5aa7ff"),
    status: "Ready",
    isReady: true,
    isHost: false,
  },
  {
    name: "QuizWiz",
    avatar: getAvatarUrl("Violet", "ff8fab"),
    status: "Ready",
    isReady: true,
    isHost: false,
  },
  {
    name: "FastFingers...",
    avatar: getAvatarUrl("Dash", "34343d"),
    status: "Joining",
    isReady: false,
    isHost: false,
  },
];

export type Player = (typeof players)[number];

export const maxPlayers = 12;
export const emptySlots = Array.from({ length: 3 }, (_, index) => index);
