import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";
import { getApiBaseUrl } from "./gameApi";

export type GameHubStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "offline";

export const gameHubEvents = [
  "PlayerJoined",
  "PlayerReadyChanged",
  "RoomSettingsChanged",
  "GameStarted",
  "CategorySelectionStarted",
  "CategoryVoteUpdated",
  "QuestionStarted",
  "AnswerSubmitted",
  "QuestionResultPublished",
  "LeaderboardUpdated",
  "GameFinished",
] as const;

export function createGameHubConnection() {
  return new HubConnectionBuilder()
    .withUrl(`${getApiBaseUrl()}/hubs/game`)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Warning)
    .build();
}

export async function startGameHub(
  connection: HubConnection,
  roomCode: string,
) {
  if (connection.state === HubConnectionState.Disconnected) {
    await connection.start();
  }

  await connection.invoke("JoinRoom", roomCode);
}

export async function stopGameHub(connection: HubConnection | null) {
  if (!connection) {
    return;
  }

  if (connection.state !== HubConnectionState.Disconnected) {
    await connection.stop();
  }
}
