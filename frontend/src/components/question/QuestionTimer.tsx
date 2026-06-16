import { motion } from "motion/react";

type QuestionTimerProps = {
  secondsLeft: number;
  totalSeconds: number;
};

const circleLength = 283;

function QuestionTimer({ secondsLeft, totalSeconds }: QuestionTimerProps) {
  const progress = secondsLeft / totalSeconds;
  const dashOffset = circleLength - progress * circleLength;
  const isEnding = secondsLeft <= 5;

  return (
    <motion.div
      className="relative flex h-32 w-32 items-center justify-center"
      initial={{ opacity: 0, y: -18, scale: 0.75, rotate: -8 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isEnding ? [1, 1.05, 1] : 1,
        rotate: 0,
        filter: isEnding
          ? [
              "drop-shadow(0 0 0 rgba(255,178,183,0))",
              "drop-shadow(0 0 18px rgba(255,178,183,0.55))",
              "drop-shadow(0 0 0 rgba(255,178,183,0))",
            ]
          : "drop-shadow(0 0 10px rgba(128,131,255,0.28))",
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        scale: isEnding ? { duration: 0.9, repeat: Infinity } : undefined,
        filter: isEnding ? { duration: 0.9, repeat: Infinity } : undefined,
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle
          className="text-[#34343d]"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
        />
        <motion.circle
          className={isEnding ? "text-[#ffb2b7]" : "text-[#8083ff]"}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="8"
          strokeDasharray={circleLength}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center">
        <motion.span
          key={secondsLeft}
          className="text-5xl leading-none font-extrabold tabular-nums text-[#e4e1ed]"
          initial={{ opacity: 0, y: -8, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18 }}
        >
          {secondsLeft}
        </motion.span>
        <span className="-mt-1 text-xs font-bold tracking-[0.1em] text-[#c7c4d7] uppercase">
          sec
        </span>
      </div>
    </motion.div>
  );
}

export default QuestionTimer;
