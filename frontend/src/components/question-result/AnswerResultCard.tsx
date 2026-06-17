import { motion } from "motion/react";
import type { QuestionAnswer } from "../../lib/question";

type AnswerResultCardProps = {
  answer: QuestionAnswer;
  correctAnswer: QuestionAnswer;
  isCorrect: boolean;
};

const resultStyles = {
  correct: {
    border: "border-[#4ae176]",
    background: "bg-[#1f1f27]/82",
    glow: "shadow-[0_0_30px_rgba(74,225,118,0.34),0_1px_0_rgba(255,255,255,0.06)_inset]",
    overlay: "bg-[#4ae176]/10",
    badge: "bg-[#4ae176] text-[#003915] shadow-[#4ae176]/35",
    iconWrap: "border-[#4ae176]/50 bg-[#4ae176]/20",
    icon: "check_circle",
    iconText: "text-[#4ae176]",
  },
  incorrect: {
    border: "border-[#ff5c7a]",
    background: "bg-[#1f1f27]/82",
    glow: "shadow-[0_0_30px_rgba(255,92,122,0.34),0_1px_0_rgba(255,255,255,0.06)_inset]",
    overlay: "bg-[#ff5c7a]/10",
    badge: "bg-[#ff5c7a] text-[#3f0010] shadow-[#ff5c7a]/35",
    iconWrap: "border-[#ff5c7a]/50 bg-[#ff5c7a]/20",
    icon: "cancel",
    iconText: "text-[#ff5c7a]",
  },
} as const;

function AnswerResultCard({
  answer,
  correctAnswer,
  isCorrect,
}: AnswerResultCardProps) {
  const styles = isCorrect ? resultStyles.correct : resultStyles.incorrect;

  return (
    <motion.div
      className="mb-10 w-full max-w-2xl"
      initial={{ opacity: 0, y: 28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.15 }}
      whileHover={{ scale: 1.015 }}
    >
      <div
        className={`relative overflow-hidden rounded-[2rem] border ${styles.border} ${styles.background} p-6 ${styles.glow} backdrop-blur-xl`}
      >
        <motion.div
          className={`absolute inset-0 ${styles.overlay}`}
          animate={{ opacity: [0.55, 0.9, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 flex items-center justify-between gap-5">
          <div className="flex min-w-0 items-center gap-4">
            <motion.div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${styles.badge} text-xl font-extrabold shadow-lg`}
              initial={{ rotate: -25, scale: 0.75 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 360,
                damping: 18,
                delay: 0.25,
              }}
            >
              {answer.letter || "!"}
            </motion.div>
            <span className="min-w-0 break-words text-[30px] leading-tight font-extrabold text-white md:text-4xl">
              {answer.answer}
            </span>
          </div>

          <motion.div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border ${styles.iconWrap}`}
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 20,
              delay: 0.35,
            }}
          >
            <span
              className={`material-symbols-outlined text-4xl ${styles.iconText}`}
              data-weight="fill"
              aria-hidden="true"
            >
              {styles.icon}
            </span>
          </motion.div>
        </div>

        {!isCorrect ? (
          <motion.div
            className="relative z-10 mt-5 border-t border-white/10 pt-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.4 }}
          >
            <p className="text-xs font-extrabold tracking-[0.18em] text-[#e4e1ed]/70 uppercase">
              The Answer Was...
            </p>
            <div className="mt-3 flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#4ae176] text-base font-extrabold text-[#003915] shadow-lg shadow-[#4ae176]/25">
                {correctAnswer.letter}
              </span>
              <span className="min-w-0 break-words text-xl leading-tight font-extrabold text-white md:text-2xl">
                {correctAnswer.answer}
              </span>
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

export default AnswerResultCard;
