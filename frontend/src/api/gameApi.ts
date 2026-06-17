import type {
  CategoryVoteRequest,
  CreateRoomRequest,
  CreateRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  RoomSnapshot,
  SetReadyRequest,
  StartGameRequest,
  SubmitAnswerRequest,
  UpdateRoomSettingsRequest,
  ApiProblem,
} from "./gameTypes";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5069"
).replace(/\/$/, "");

export class GameApiError extends Error {
  status: number;
  code?: string;

  constructor(problem: ApiProblem, fallbackMessage: string) {
    super(problem.detail || problem.title || fallbackMessage);
    this.name = "GameApiError";
    this.status = problem.status ?? 500;
    this.code = problem.code || problem.title;
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function createRoom(request: CreateRoomRequest) {
  return send<CreateRoomResponse>("/api/rooms", {
    method: "POST",
    body: request,
  });
}

export async function joinRoom(roomCode: string, request: JoinRoomRequest) {
  return send<JoinRoomResponse>(`/api/rooms/${encodeURIComponent(roomCode)}/players`, {
    method: "POST",
    body: request,
  });
}

export async function getRoom(roomCode: string) {
  return send<RoomSnapshot>(`/api/rooms/${encodeURIComponent(roomCode)}`);
}

export async function updateRoomSettings(
  roomCode: string,
  request: UpdateRoomSettingsRequest,
) {
  return send<RoomSnapshot>(`/api/rooms/${encodeURIComponent(roomCode)}/settings`, {
    method: "PATCH",
    body: request,
  });
}

export async function setPlayerReady(
  roomCode: string,
  playerId: string,
  request: SetReadyRequest,
) {
  return send<RoomSnapshot>(
    `/api/rooms/${encodeURIComponent(roomCode)}/players/${encodeURIComponent(
      playerId,
    )}/ready`,
    {
      method: "PATCH",
      body: request,
    },
  );
}

export async function startGame(roomCode: string, request: StartGameRequest) {
  return send<RoomSnapshot>(`/api/rooms/${encodeURIComponent(roomCode)}/start`, {
    method: "POST",
    body: request,
  });
}

export async function voteCategory(roomCode: string, request: CategoryVoteRequest) {
  return send(`/api/rooms/${encodeURIComponent(roomCode)}/category-votes`, {
    method: "POST",
    body: request,
  });
}

export async function submitAnswer(roomCode: string, request: SubmitAnswerRequest) {
  return send(`/api/rooms/${encodeURIComponent(roomCode)}/answers`, {
    method: "POST",
    body: request,
  });
}

type SendOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

async function send<T = unknown>(path: string, options: SendOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    let problem: ApiProblem = {
      status: response.status,
      title: response.statusText,
    };

    try {
      problem = { ...problem, ...(await response.json()) };
    } catch {
      // Keep the fallback problem details when the response has no JSON body.
    }

    throw new GameApiError(problem, "Request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
