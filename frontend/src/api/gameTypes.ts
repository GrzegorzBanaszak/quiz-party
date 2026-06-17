export type RoomState =
  | "Lobby"
  | "CategorySelection"
  | "Question"
  | "QuestionResult"
  | "Finished";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export type GameSettings = {
  questionsPerRound: number;
  roundsCount: number;
  answerTimeSeconds: number;
  maxPlayers: number;
};

export type Player = {
  id: string;
  name: string;
  avatar?: string | null;
  isHost: boolean;
  isReady: boolean;
  score: number;
  rank: number;
};

export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Answer = {
  id: string;
  letter: string;
  text: string;
};

export type Question = {
  id: string;
  categoryId: string;
  text: string;
  answers: Answer[];
  difficulty: QuestionDifficulty;
  pointsPool: number;
  timeLimitSeconds: number;
};

export type ScoreEntry = {
  playerId: string;
  playerName: string;
  points: number;
  rank: number;
  previousRank: number;
  rankChange: number;
};

export type PlayerQuestionResult = {
  playerId: string;
  selectedAnswerId?: string | null;
  isCorrect: boolean;
  pointsGained: number;
  totalPoints: number;
  rank: number;
  previousRank: number;
  rankChange: number;
};

export type QuestionResult = {
  questionId: string;
  correctAnswerId: string;
  correctAnswerText: string;
  playerResults: PlayerQuestionResult[];
  leaderboard: ScoreEntry[];
};

export type RoomSnapshot = {
  code: string;
  state: RoomState;
  hostPlayerId: string;
  settings: GameSettings;
  players: Player[];
  categories: Category[];
  currentRound: number;
  currentQuestionIndex: number;
  currentCategoryId?: string | null;
  currentQuestion?: Question | null;
  lastQuestionResult?: QuestionResult | null;
  leaderboard: ScoreEntry[];
  selectedCategoryIds: string[];
  categoryVoteCounts: Record<string, number>;
  answeredCount: number;
  totalPlayers: number;
  createdAtUtc: string;
  updatedAtUtc: string;
  questionStartedAtUtc?: string | null;
  finishedAtUtc?: string | null;
};

export type CreateRoomRequest = {
  playerName: string;
  avatar?: string | null;
};

export type CreateRoomResponse = {
  roomCode: string;
  playerId: string;
  state: RoomState;
};

export type JoinRoomRequest = CreateRoomRequest;

export type JoinRoomResponse = CreateRoomResponse;

export type UpdateRoomSettingsRequest = Partial<GameSettings> & {
  hostPlayerId: string;
};

export type SetReadyRequest = {
  isReady: boolean;
};

export type StartGameRequest = {
  hostPlayerId: string;
};

export type ReturnToLobbyRequest = {
  playerId: string;
};

export type CategoryVoteRequest = {
  playerId: string;
  categoryId: string;
};

export type SubmitAnswerRequest = {
  playerId: string;
  questionId: string;
  answerId: string;
  answeredAtMs: number;
};

export type ApiProblem = {
  title?: string;
  detail?: string;
  status?: number;
  code?: string;
};
