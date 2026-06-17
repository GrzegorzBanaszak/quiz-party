import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  createRoom,
  getRoom,
  joinRoom,
  setPlayerReady,
  startGame,
  submitAnswer,
  updateRoomSettings,
  voteCategory,
  GameApiError,
} from "../api/gameApi";
import {
  createGameHubConnection,
  gameHubEvents,
  startGameHub,
  stopGameHub,
  type GameHubStatus,
} from "../api/gameHub";
import type { GameSettings, RoomSnapshot } from "../api/gameTypes";
import {
  clearStoredGameSession,
  loadStoredGameSession,
  saveStoredGameSession,
  type StoredGameSession,
} from "./sessionStorage";

type GameSessionState = {
  snapshot: RoomSnapshot | null;
  session: StoredGameSession | null;
  isLoading: boolean;
  error: string | null;
  connectionStatus: GameHubStatus;
  selectedCategoryId: string | null;
  selectedAnswerId: string | null;
  submittedQuestionId: string | null;
};

type GameSessionContextValue = GameSessionState & {
  localPlayer: RoomSnapshot["players"][number] | null;
  isHost: boolean;
  createGame: (playerName: string, avatar?: string | null) => Promise<string>;
  joinGame: (
    roomCode: string,
    playerName: string,
    avatar?: string | null,
  ) => Promise<string>;
  loadRoom: (roomCode: string) => Promise<void>;
  refreshRoom: () => Promise<void>;
  clearError: () => void;
  setReady: (isReady: boolean) => Promise<void>;
  updateSettings: (settings: Partial<GameSettings>) => Promise<void>;
  startGame: () => Promise<void>;
  voteCategory: (categoryId: string) => Promise<void>;
  submitAnswer: (answerId: string, answeredAtMs: number) => Promise<void>;
  clearSession: () => void;
};

type GameSessionAction =
  | { type: "loading"; value: boolean }
  | { type: "error"; value: string | null }
  | { type: "snapshot"; value: RoomSnapshot | null }
  | { type: "session"; value: StoredGameSession | null }
  | { type: "connection"; value: GameHubStatus }
  | { type: "selected-category"; value: string | null }
  | { type: "selected-answer"; value: string | null; questionId?: string | null }
  | { type: "reset-round-local-state" };

const GameSessionContext = createContext<GameSessionContextValue | null>(null);

const initialState: GameSessionState = {
  snapshot: null,
  session: typeof window === "undefined" ? null : loadStoredGameSession(),
  isLoading: false,
  error: null,
  connectionStatus: "idle",
  selectedCategoryId: null,
  selectedAnswerId: null,
  submittedQuestionId: null,
};

function gameSessionReducer(
  state: GameSessionState,
  action: GameSessionAction,
): GameSessionState {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: action.value };
    case "error":
      return { ...state, error: action.value };
    case "snapshot":
      return { ...state, snapshot: action.value, error: null };
    case "session":
      return { ...state, session: action.value };
    case "connection":
      return { ...state, connectionStatus: action.value };
    case "selected-category":
      return { ...state, selectedCategoryId: action.value };
    case "selected-answer":
      return {
        ...state,
        selectedAnswerId: action.value,
        submittedQuestionId: action.questionId ?? state.submittedQuestionId,
      };
    case "reset-round-local-state":
      return {
        ...state,
        selectedCategoryId: null,
        selectedAnswerId: null,
        submittedQuestionId: null,
      };
  }
}

export function GameSessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameSessionReducer, initialState);
  const activeRoomCode = state.snapshot?.code ?? state.session?.roomCode ?? null;

  const handleError = useCallback((error: unknown) => {
    if (error instanceof GameApiError) {
      dispatch({ type: "error", value: error.message });
      if (error.status === 404) {
        clearStoredGameSession();
        dispatch({ type: "session", value: null });
      }
      return;
    }

    dispatch({
      type: "error",
      value: error instanceof Error ? error.message : "Wystapil blad.",
    });
  }, []);

  const setSession = useCallback((session: StoredGameSession) => {
    saveStoredGameSession(session);
    dispatch({ type: "session", value: session });
  }, []);

  const loadRoom = useCallback(
    async (roomCode: string) => {
      dispatch({ type: "loading", value: true });
      try {
        const snapshot = await getRoom(roomCode);
        const storedSession = loadStoredGameSession();
        if (
          storedSession &&
          storedSession.roomCode.toUpperCase() !== snapshot.code.toUpperCase()
        ) {
          clearStoredGameSession();
          dispatch({ type: "session", value: null });
        }
        dispatch({ type: "snapshot", value: snapshot });
      } catch (error) {
        handleError(error);
      } finally {
        dispatch({ type: "loading", value: false });
      }
    },
    [handleError],
  );

  const refreshRoom = useCallback(async () => {
    const roomCode = activeRoomCode;
    if (!roomCode) {
      return;
    }

    try {
      const snapshot = await getRoom(roomCode);
      dispatch({ type: "snapshot", value: snapshot });
    } catch (error) {
      handleError(error);
    }
  }, [activeRoomCode, handleError]);

  const createGame = useCallback(
    async (playerName: string, avatar?: string | null) => {
      dispatch({ type: "loading", value: true });
      try {
        const response = await createRoom({ playerName, avatar });
        setSession({
          roomCode: response.roomCode,
          playerId: response.playerId,
          playerName,
          avatar,
          isHost: true,
        });
        const snapshot = await getRoom(response.roomCode);
        dispatch({ type: "snapshot", value: snapshot });
        return response.roomCode;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        dispatch({ type: "loading", value: false });
      }
    },
    [handleError, setSession],
  );

  const joinGame = useCallback(
    async (roomCode: string, playerName: string, avatar?: string | null) => {
      dispatch({ type: "loading", value: true });
      try {
        const response = await joinRoom(roomCode, { playerName, avatar });
        setSession({
          roomCode: response.roomCode,
          playerId: response.playerId,
          playerName,
          avatar,
          isHost: false,
        });
        const snapshot = await getRoom(response.roomCode);
        dispatch({ type: "snapshot", value: snapshot });
        return response.roomCode;
      } catch (error) {
        handleError(error);
        throw error;
      } finally {
        dispatch({ type: "loading", value: false });
      }
    },
    [handleError, setSession],
  );

  const clearSession = useCallback(() => {
    clearStoredGameSession();
    dispatch({ type: "session", value: null });
    dispatch({ type: "snapshot", value: null });
    dispatch({ type: "reset-round-local-state" });
  }, []);

  const commandRoomCode = state.snapshot?.code ?? state.session?.roomCode;
  const playerId = state.session?.playerId;

  const runCommand = useCallback(
    async (command: () => Promise<RoomSnapshot | unknown>, shouldRefresh = true) => {
      try {
        const result = await command();
        if (isRoomSnapshot(result)) {
          dispatch({ type: "snapshot", value: result });
        } else if (shouldRefresh) {
          await refreshRoom();
        }
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
    [handleError, refreshRoom],
  );

  const contextValue = useMemo<GameSessionContextValue>(() => {
    const localPlayer =
      state.snapshot?.players.find((player) => player.id === state.session?.playerId) ??
      null;
    const isHost = state.snapshot?.hostPlayerId === state.session?.playerId;

    return {
      ...state,
      localPlayer,
      isHost,
      createGame,
      joinGame,
      loadRoom,
      refreshRoom,
      clearError: () => dispatch({ type: "error", value: null }),
      setReady: async (isReady: boolean) => {
        if (!commandRoomCode || !playerId) {
          return;
        }

        await runCommand(() =>
          setPlayerReady(commandRoomCode, playerId, { isReady }),
        );
      },
      updateSettings: async (settings: Partial<GameSettings>) => {
        if (!commandRoomCode || !playerId) {
          return;
        }

        await runCommand(() =>
          updateRoomSettings(commandRoomCode, {
            ...settings,
            hostPlayerId: playerId,
          }),
        );
      },
      startGame: async () => {
        if (!commandRoomCode || !playerId) {
          return;
        }

        await runCommand(() =>
          startGame(commandRoomCode, { hostPlayerId: playerId }),
        );
      },
      voteCategory: async (categoryId: string) => {
        if (!commandRoomCode || !playerId) {
          return;
        }

        dispatch({ type: "selected-category", value: categoryId });
        await runCommand(() =>
          voteCategory(commandRoomCode, { playerId, categoryId }),
        );
      },
      submitAnswer: async (answerId: string, answeredAtMs: number) => {
        const question = state.snapshot?.currentQuestion;
        if (!commandRoomCode || !playerId || !question) {
          return;
        }

        dispatch({
          type: "selected-answer",
          value: answerId,
          questionId: question.id,
        });
        await runCommand(() =>
          submitAnswer(commandRoomCode, {
            playerId,
            questionId: question.id,
            answerId,
            answeredAtMs,
          }),
        );
      },
      clearSession,
    };
  }, [
    clearSession,
    commandRoomCode,
    createGame,
    joinGame,
    loadRoom,
    playerId,
    refreshRoom,
    runCommand,
    state,
  ]);

  useEffect(() => {
    const questionId = state.snapshot?.currentQuestion?.id;
    if (
      state.snapshot?.state === "Question" &&
      questionId &&
      state.submittedQuestionId !== questionId
    ) {
      dispatch({ type: "selected-answer", value: null, questionId: null });
    }

    if (state.snapshot?.state === "CategorySelection") {
      dispatch({ type: "selected-category", value: null });
    }
  }, [
    state.snapshot?.currentQuestion?.id,
    state.snapshot?.state,
    state.submittedQuestionId,
  ]);

  useEffect(() => {
    const roomCode = activeRoomCode;
    if (!roomCode) {
      return undefined;
    }

    let isDisposed = false;
    const connection = createGameHubConnection();

    for (const eventName of gameHubEvents) {
      connection.on(eventName, () => {
        void refreshRoom();
      });
    }

    connection.onreconnecting(() => {
      if (!isDisposed) {
        dispatch({ type: "connection", value: "reconnecting" });
      }
    });
    connection.onreconnected(() => {
      if (!isDisposed) {
        dispatch({ type: "connection", value: "connected" });
        void startGameHub(connection, roomCode).then(refreshRoom).catch(handleError);
      }
    });
    connection.onclose(() => {
      if (!isDisposed) {
        dispatch({ type: "connection", value: "offline" });
      }
    });

    dispatch({ type: "connection", value: "connecting" });
    void startGameHub(connection, roomCode)
      .then(() => {
        if (!isDisposed) {
          dispatch({ type: "connection", value: "connected" });
        }
      })
      .catch((error: unknown) => {
        if (!isDisposed) {
          dispatch({ type: "connection", value: "offline" });
          handleError(error);
        }
      });

    return () => {
      isDisposed = true;
      void stopGameHub(connection);
    };
  }, [activeRoomCode, handleError, refreshRoom]);

  useEffect(() => {
    function refreshWhenActive() {
      if (document.visibilityState === "visible" && navigator.onLine) {
        void refreshRoom();
      }
    }

    window.addEventListener("focus", refreshWhenActive);
    window.addEventListener("online", refreshWhenActive);
    document.addEventListener("visibilitychange", refreshWhenActive);

    return () => {
      window.removeEventListener("focus", refreshWhenActive);
      window.removeEventListener("online", refreshWhenActive);
      document.removeEventListener("visibilitychange", refreshWhenActive);
    };
  }, [refreshRoom]);

  return (
    <GameSessionContext.Provider value={contextValue}>
      {children}
    </GameSessionContext.Provider>
  );
}

export function useGameSession() {
  const context = useContext(GameSessionContext);
  if (!context) {
    throw new Error("useGameSession must be used within GameSessionProvider.");
  }

  return context;
}

function isRoomSnapshot(value: unknown): value is RoomSnapshot {
  return (
    typeof value === "object" &&
    value !== null &&
    "state" in value &&
    "code" in value &&
    "players" in value
  );
}
