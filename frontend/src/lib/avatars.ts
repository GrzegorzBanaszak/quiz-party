export const avatarSeeds = [
  "Nova",
  "Pixel",
  "Buzz",
  "Violet",
  "Sunny",
  "Orbit",
  "Dash",
  "Mika",
];

export const avatarBackgroundColors = [
  "a67df5",
  "5aa7ff",
  "ff8fab",
  "ffd166",
  "69db7c",
  "b197fc",
];

export function getAvatarUrl(seed: string, backgroundColor: string) {
  const params = new URLSearchParams({
    seed,
    backgroundColor,
    radius: "50",
  });

  return `https://api.dicebear.com/10.x/fun-emoji/svg?${params.toString()}`;
}
