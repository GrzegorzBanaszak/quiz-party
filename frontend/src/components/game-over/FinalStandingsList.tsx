import { motion, type Variants } from "motion/react";
import type { FinalStanding } from "../../lib/gameOver";

type FinalStandingsListProps = {
  standings: FinalStanding[];
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function FinalStandingsList({ standings }: FinalStandingsListProps) {
  return (
    <motion.section
      className="w-full max-w-2xl rounded-[2rem] border border-[#464554] bg-[#13131b]/74 p-4 shadow-lg backdrop-blur-xl"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 240, damping: 26, delay: 0.22 }}
    >
      <h3 className="mb-4 border-b border-[#464554] pb-3 text-2xl font-extrabold text-[#e4e1ed]">
        Final standings
      </h3>

      <motion.div className="flex flex-col gap-2" variants={listVariants} initial="hidden" animate="visible">
        {standings.slice(1).map((player) => (
          <motion.div
            key={player.rank}
            variants={itemVariants}
            className="group flex items-center justify-between rounded-[1.25rem] bg-[#1b1b23] p-3 transition-colors hover:bg-[#34343d]"
            whileHover={{ x: 4 }}
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="w-6 text-center text-lg font-extrabold text-[#c7c4d7]">
                {player.rank}
              </span>
              <img
                src={player.avatar}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full border-2 border-[#464554] bg-[#292932] object-cover"
              />
              <span className="truncate text-lg font-bold text-[#e4e1ed]">
                {player.name}
              </span>
            </div>
            <span className="shrink-0 text-sm font-bold text-[#c7c4d7] transition-colors group-hover:text-[#4ae176]">
              {player.points.toLocaleString("pl-PL")} pkt
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

export default FinalStandingsList;
