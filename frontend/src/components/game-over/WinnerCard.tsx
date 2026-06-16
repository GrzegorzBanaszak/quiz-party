import { motion } from "motion/react";
import type { FinalStanding } from "../../lib/gameOver";

type WinnerCardProps = {
  winner: FinalStanding;
};

function WinnerCard({ winner }: WinnerCardProps) {
  return (
    <motion.section
      className="relative flex w-full max-w-md flex-col items-center overflow-hidden rounded-[3rem] border-2 border-[#ffb2b7]/80 bg-[#1f1f27]/84 p-6 shadow-[0_0_34px_rgba(255,178,183,0.34),0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-xl"
      initial={{ opacity: 0, y: 34, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 22, delay: 0.12 }}
      whileHover={{ scale: 1.025 }}
    >
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-[#ffb2b7] opacity-25 blur-[54px]" />
      <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-[#c0c1ff] opacity-20 blur-[54px]" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="mb-3 flex items-center gap-2 text-5xl font-extrabold text-[#ffb2b7]"
          initial={{ scale: 0.7, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.28 }}
        >
          <span
            className="material-symbols-outlined text-5xl"
            data-weight="fill"
            aria-hidden="true"
          >
            emoji_events
          </span>
          <span>1ST</span>
        </motion.div>

        <motion.div
          className="mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-[#ffb2b7] bg-[#292932] shadow-[0_0_24px_rgba(255,178,183,0.52)]"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src={winner.avatar} alt="" className="h-full w-full object-cover" />
        </motion.div>

        <h2 className="text-3xl font-extrabold text-[#e4e1ed]">
          {winner.name}
        </h2>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-[#292932] px-4 py-2">
          <span className="material-symbols-outlined text-[#4ae176]" aria-hidden="true">
            star
          </span>
          <span className="text-lg font-extrabold text-[#4ae176]">
            {winner.points.toLocaleString("pl-PL")} pkt
          </span>
        </div>
      </div>
    </motion.section>
  );
}

export default WinnerCard;
