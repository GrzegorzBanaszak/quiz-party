import { motion } from "motion/react";
import type { QuestionAnswer } from "../../lib/question";

type CorrectAnswerCardProps = {
  answer: QuestionAnswer;
};

function CorrectAnswerCard({ answer }: CorrectAnswerCardProps) {
  return (
    <motion.div
      className="mb-10 w-full max-w-2xl"
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.15 }}
      whileHover={{ scale: 1.015 }}
    >
      <div className="relative flex items-center justify-between overflow-hidden rounded-[2rem] border border-[#4ae176] bg-[#1f1f27]/82 p-6 shadow-[0_0_30px_rgba(74,225,118,0.34),0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-xl">
        <motion.div
          className="absolute inset-0 bg-[#4ae176]/10"
          animate={{ opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 flex min-w-0 items-center gap-4">
          <motion.div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#4ae176] text-xl font-extrabold text-[#003915] shadow-lg shadow-[#4ae176]/35"
            initial={{ rotate: -25, scale: 0.75 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 360, damping: 18, delay: 0.25 }}
          >
            {answer.letter}
          </motion.div>
          <span className="truncate text-[30px] leading-tight font-extrabold text-white md:text-4xl">
            {answer.answer}
          </span>
        </div>

        <motion.div
          className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#4ae176]/50 bg-[#4ae176]/20"
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 20, delay: 0.35 }}
        >
          <span
            className="material-symbols-outlined text-4xl text-[#4ae176]"
            data-weight="fill"
            aria-hidden="true"
          >
            check_circle
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default CorrectAnswerCard;
