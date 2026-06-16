import { motion } from "motion/react";

type QuestionProgressFooterProps = {
  answeredPlayers: number;
  totalPlayers: number;
  selectedAnswer: string | null;
};

function QuestionProgressFooter({
  answeredPlayers,
  totalPlayers,
  selectedAnswer,
}: QuestionProgressFooterProps) {
  const answeredPercentage = (answeredPlayers / totalPlayers) * 100;

  return (
    <motion.footer
      className="relative z-10 flex w-full justify-center px-4 py-6"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.18 }}
    >
      <motion.div
        layout
        className="w-full max-w-[420px] rounded-[1.5rem] border border-white/10 bg-[#1f1f27]/72 px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <motion.span
              className="material-symbols-outlined text-[#4ae176]"
              data-weight="fill"
              aria-hidden="true"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              groups
            </motion.span>
            <span className="text-base font-bold tracking-normal text-[#e4e1ed]">
              {answeredPlayers} / {totalPlayers} graczy odpowiedziało
            </span>
          </div>
          {selectedAnswer ? (
            <motion.span
              className="rounded-full bg-[#4ae176]/16 px-3 py-1 text-xs font-extrabold text-[#4ae176]"
              initial={{ opacity: 0, x: 10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
            >
              Wybrano {selectedAnswer}
            </motion.span>
          ) : null}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#34343d]">
          <motion.div
            className="h-full rounded-full bg-[#4ae176]"
            initial={false}
            animate={{ width: `${answeredPercentage}%` }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
          />
        </div>
      </motion.div>
    </motion.footer>
  );
}

export default QuestionProgressFooter;
