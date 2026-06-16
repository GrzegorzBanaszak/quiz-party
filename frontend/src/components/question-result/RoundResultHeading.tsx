import { motion } from "motion/react";

type RoundResultHeadingProps = {
  questionIndex: number;
  totalQuestions: number;
};

function RoundResultHeading({
  questionIndex,
  totalQuestions,
}: RoundResultHeadingProps) {
  return (
    <motion.div
      className="mb-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <motion.span
        className="mb-3 inline-flex rounded-full bg-[#8083ff]/18 px-4 py-2 text-xs font-extrabold tracking-[0.1em] text-[#c0c1ff] uppercase"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 360, damping: 20, delay: 0.1 }}
      >
        Pytanie {questionIndex} / {totalQuestions}
      </motion.span>
      <h2 className="mb-2 text-sm font-extrabold tracking-[0.18em] text-[#ffb2b7] uppercase">
        Round complete
      </h2>
      <h1 className="text-[32px] leading-tight font-extrabold tracking-normal text-white drop-shadow-lg md:text-5xl">
        Prawidłowa odpowiedź
      </h1>
    </motion.div>
  );
}

export default RoundResultHeading;
