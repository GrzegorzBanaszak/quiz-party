import { motion } from "motion/react";

type QuestionPromptCardProps = {
  label: string;
  question: string;
  isActive: boolean;
};

function QuestionPromptCard({ label, question, isActive }: QuestionPromptCardProps) {
  return (
    <motion.div
      layout
      className="w-full max-w-4xl rounded-[3rem] border border-white/10 bg-[#1f1f27]/72 p-8 text-center shadow-xl shadow-black/20 backdrop-blur-xl md:p-12"
      initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(8px)" }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isActive ? 1 : [1, 1.015, 1],
        filter: "blur(0px)",
        boxShadow: isActive
          ? "0 24px 60px rgba(0, 0, 0, 0.22)"
          : "0 24px 60px rgba(0, 0, 0, 0.28), 0 0 42px rgba(128, 131, 255, 0.16)",
      }}
      transition={{
        layout: { type: "spring", stiffness: 260, damping: 28 },
        opacity: { duration: 0.35 },
        y: { type: "spring", stiffness: 220, damping: 24 },
        scale: isActive ? { duration: 0.25 } : { duration: 1.8, repeat: Infinity },
      }}
    >
      <motion.span
        className="mb-4 inline-flex rounded-full bg-[#8083ff]/18 px-4 py-2 text-xs font-extrabold tracking-[0.1em] text-[#c0c1ff] uppercase"
        animate={{ scale: isActive ? 1 : [1, 1.04, 1] }}
        transition={{ duration: 1.4, repeat: isActive ? 0 : Infinity }}
      >
        {label}
      </motion.span>
      <h1 className="text-[32px] leading-tight font-extrabold tracking-normal text-[#e4e1ed] md:text-5xl">
        {question}
      </h1>
      {!isActive ? (
        <motion.p
          className="mt-5 text-lg font-medium text-[#c7c4d7]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          Za chwilę pojawią się odpowiedzi i rozpocznie się odliczanie.
        </motion.p>
      ) : null}
    </motion.div>
  );
}

export default QuestionPromptCard;
