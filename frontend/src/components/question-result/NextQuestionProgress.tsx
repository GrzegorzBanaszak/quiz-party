import { motion } from "motion/react";

type NextQuestionProgressProps = {
  secondsLeft: number;
  totalSeconds: number;
};

function NextQuestionProgress({
  secondsLeft,
  totalSeconds,
}: NextQuestionProgressProps) {
  const progress = (secondsLeft / totalSeconds) * 100;
  const isEnding = secondsLeft <= 1;

  return (
    <motion.div
      className="fixed bottom-0 left-0 z-20 w-full border-t border-[#464554] bg-[#34343d] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.5 }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-4">
        <div className="flex items-center justify-between text-sm font-extrabold">
          <span className="animate-pulse text-[#c0c1ff]">
            Następne pytanie za chwilę...
          </span>
          <span className="text-[#c7c4d7]">0:0{secondsLeft}</span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full border border-[#464554]/50 bg-[#13131b]">
          <motion.div
            className={`h-full rounded-full ${
              isEnding ? "bg-[#ffb2b7]" : "bg-[#c0c1ff]"
            }`}
            initial={false}
            animate={{
              width: `${progress}%`,
              boxShadow: isEnding
                ? "0 0 12px rgba(255,178,183,0.52)"
                : "0 0 12px rgba(192,193,255,0.52)",
              backgroundPositionX: ["0rem", "1rem"],
            }}
            transition={{
              width: { duration: 0.5 },
              boxShadow: { duration: 0.2 },
              backgroundPositionX: {
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            style={{
              backgroundImage:
                "linear-gradient(45deg, rgba(255,255,255,0.16) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.16) 75%, transparent 75%, transparent)",
              backgroundSize: "1rem 1rem",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default NextQuestionProgress;
