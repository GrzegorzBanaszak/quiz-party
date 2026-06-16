import { motion } from "motion/react";

const confettiColors = ["#c0c1ff", "#b50036", "#4ae176", "#ffb2b7", "#8083ff"];
const confettiPieces = Array.from({ length: 42 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: (index % 12) * 0.18,
  duration: 2.4 + (index % 5) * 0.35,
  color: confettiColors[index % confettiColors.length],
  width: index % 2 === 0 ? 8 : 10,
  height: index % 3 === 0 ? 16 : 10,
}));

function GameOverBackground() {
  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,178,183,0.16)_0%,rgba(31,31,39,0.58)_36%,rgba(13,13,21,1)_78%)]" />
      <motion.div
        className="fixed inset-0 opacity-55"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, rgba(192,193,255,0.18), transparent 28%), radial-gradient(circle at 80% 72%, rgba(255,178,183,0.16), transparent 30%)",
            "radial-gradient(circle at 30% 32%, rgba(74,225,118,0.12), transparent 30%), radial-gradient(circle at 68% 62%, rgba(192,193,255,0.22), transparent 32%)",
            "radial-gradient(circle at 20% 20%, rgba(192,193,255,0.18), transparent 28%), radial-gradient(circle at 80% 72%, rgba(255,178,183,0.16), transparent 30%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-[#13131b]/72 to-[#13131b]" />

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {confettiPieces.map((piece) => (
          <motion.span
            key={piece.id}
            className="absolute top-0 rounded-[2px]"
            style={{
              left: piece.left,
              width: piece.width,
              height: piece.height,
              backgroundColor: piece.color,
            }}
            initial={{ y: -120, rotate: 0, opacity: 0 }}
            animate={{
              y: "110vh",
              rotate: [0, 180, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              repeat: Infinity,
              repeatDelay: 1.8,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </>
  );
}

export default GameOverBackground;
