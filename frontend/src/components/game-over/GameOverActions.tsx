import { motion } from "motion/react";

type GameOverActionsProps = {
  canReturnToLobby: boolean;
  isBusy: boolean;
  pendingAction: "leave" | "return-to-lobby" | null;
  onExitToMenu: () => void;
  onReturnToLobby: () => void;
};

function GameOverActions({
  canReturnToLobby,
  isBusy,
  pendingAction,
  onExitToMenu,
  onReturnToLobby,
}: GameOverActionsProps) {
  return (
    <motion.div
      className="mt-2 flex w-full max-w-md flex-col gap-4 sm:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.38 }}
    >
      <motion.div className="flex-1" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        <button
          type="button"
          disabled={isBusy}
          onClick={onExitToMenu}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-[#464554] bg-transparent px-6 py-4 text-lg font-extrabold text-[#e4e1ed] transition hover:border-[#393841] hover:bg-[#34343d] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            home
          </span>
          {pendingAction === "leave" ? "Wychodzenie..." : "Menu główne"}
        </button>
      </motion.div>

      <motion.div className="flex-1" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        <button
          type="button"
          disabled={isBusy || !canReturnToLobby}
          onClick={onReturnToLobby}
          title={canReturnToLobby ? undefined : "Tylko host może wrócić do lobby"}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#8083ff] px-6 py-4 text-lg font-extrabold text-[#0d0096] shadow-[0_0_18px_rgba(128,131,255,0.45)] transition hover:bg-[#9496ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            groups
          </span>
          {pendingAction === "return-to-lobby" ? "Wracanie..." : "Powrót do lobby"}
        </button>
      </motion.div>
    </motion.div>
  );
}

export default GameOverActions;
