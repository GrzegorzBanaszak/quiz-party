import { Link } from "react-router-dom";
import { motion } from "motion/react";

function GameOverActions() {
  return (
    <motion.div
      className="mt-2 flex w-full max-w-md flex-col gap-4 sm:flex-row"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.38 }}
    >
      <motion.div className="flex-1" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        <Link
          to="/lobby"
          className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#8083ff] px-6 py-4 text-lg font-extrabold text-[#0d0096] shadow-[0_0_18px_rgba(128,131,255,0.45)]"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            replay
          </span>
          Play Again
        </Link>
      </motion.div>

      <motion.div className="flex-1" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
        <Link
          to="/"
          className="flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-[#464554] bg-transparent px-6 py-4 text-lg font-extrabold text-[#e4e1ed] transition hover:border-[#393841] hover:bg-[#34343d]"
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            home
          </span>
          Back Home
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default GameOverActions;
