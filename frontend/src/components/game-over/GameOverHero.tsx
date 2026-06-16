import { motion } from "motion/react";

function GameOverHero() {
  return (
    <motion.header
      className="w-full text-center"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <motion.h1
        className="text-[42px] leading-none font-extrabold tracking-normal text-[#c0c1ff] uppercase italic drop-shadow-[0_0_18px_rgba(192,193,255,0.58)] md:text-6xl"
        animate={{ textShadow: ["0 0 12px rgba(192,193,255,0.5)", "0 0 24px rgba(192,193,255,0.78)", "0 0 12px rgba(192,193,255,0.5)"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        Game Over
      </motion.h1>
      <p className="mt-3 text-xl font-bold text-[#c7c4d7]">
        Quiz dobiegł końca
      </p>
    </motion.header>
  );
}

export default GameOverHero;
