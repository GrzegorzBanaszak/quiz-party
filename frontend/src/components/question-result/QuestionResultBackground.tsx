import { motion } from "motion/react";

function QuestionResultBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(74,225,118,0.14)_0%,rgba(31,31,39,0.58)_36%,rgba(13,13,21,1)_78%)]" />
      <motion.div
        className="fixed inset-[-50%] opacity-70"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(128,131,255,0.1) 45deg, transparent 90deg, rgba(74,225,118,0.1) 135deg, transparent 180deg, rgba(128,131,255,0.1) 225deg, transparent 270deg, rgba(74,225,118,0.1) 315deg, transparent 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#13131b]/80 to-[#13131b]" />
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#292932]/70 to-transparent" />
    </>
  );
}

export default QuestionResultBackground;
