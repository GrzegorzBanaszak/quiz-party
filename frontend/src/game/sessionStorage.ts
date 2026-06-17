export type StoredGameSession = {
  roomCode: string;
  playerId: string;
  playerName: string;
  avatar?: string | null;
  isHost: boolean;
};

const STORAGE_KEY = "party-quiz-session";

export function loadStoredGameSession() {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredGameSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveStoredGameSession(session: StoredGameSession) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredGameSession() {
  window.localStorage.removeItem(STORAGE_KEY);
}
