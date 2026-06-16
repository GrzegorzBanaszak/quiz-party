import { motion } from "motion/react";

function QuestionBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(128,131,255,0.16)_0%,rgba(31,31,39,0.58)_34%,rgba(13,13,21,1)_76%)]" />
      <motion.div
        className="fixed inset-0 opacity-70"
        animate={{
          background: [
            "radial-gradient(circle at 18% 26%, rgba(192,193,255,0.18), transparent 28%), radial-gradient(circle at 82% 70%, rgba(255,178,183,0.13), transparent 30%)",
            "radial-gradient(circle at 28% 34%, rgba(192,193,255,0.24), transparent 30%), radial-gradient(circle at 72% 62%, rgba(74,225,118,0.12), transparent 32%)",
            "radial-gradient(circle at 18% 26%, rgba(192,193,255,0.18), transparent 28%), radial-gradient(circle at 82% 70%, rgba(255,178,183,0.13), transparent 30%)",
          ],
          scale: [1, 1.04, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#292932]/70 to-transparent" />
    </>
  );
}

export default QuestionBackground;
