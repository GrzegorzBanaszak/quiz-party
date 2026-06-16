import { motion, type Variants } from "motion/react";
import type { RoundLeader } from "../../lib/questionResults";

type RoundLeadersListProps = {
  leaders: RoundLeader[];
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.28 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

const positionChangeStyles = {
  up: {
    icon: "arrow_upward",
    label: "Awans",
    className: "bg-[#4ae176]/12 text-[#4ae176]",
  },
  down: {
    icon: "arrow_downward",
    label: "Spadek",
    className: "bg-[#ffb2b7]/12 text-[#ffb2b7]",
  },
  same: {
    icon: "remove",
    label: "Bez zmian",
    className: "bg-[#908fa0]/12 text-[#c7c4d7]",
  },
} satisfies Record<
  RoundLeader["positionChange"],
  { icon: string; label: string; className: string }
>;

function RoundLeadersList({ leaders }: RoundLeadersListProps) {
  return (
    <motion.section
      className="flex w-full max-w-md flex-col gap-3"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="mb-1 text-center text-xs font-extrabold tracking-[0.16em] text-[#c7c4d7] uppercase">
        Liderzy rundy
      </h3>

      {leaders.map((leader) => {
        const isFirst = leader.rank === 1;

        return (
          <motion.div
            key={leader.rank}
            variants={itemVariants}
            className={`flex items-center justify-between rounded-[1.25rem] border bg-[#1f1f27]/76 p-3 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] backdrop-blur-xl ${
              isFirst
                ? "-translate-y-1 border-[#ffd166]/40 shadow-[0_8px_32px_rgba(255,209,102,0.16)]"
                : "border-white/10"
            }`}
            whileHover={{ x: 4, scale: 1.01 }}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                  isFirst
                    ? "border border-[#ffd166]/50 bg-[#ffd166]/20 text-[#ffd166] shadow-[0_0_10px_rgba(255,209,102,0.38)]"
                    : "bg-[#34343d] text-[#c7c4d7]"
                }`}
              >
                {leader.rank}
              </div>
              <img
                src={leader.avatar}
                alt=""
                className={`h-10 w-10 shrink-0 rounded-full bg-[#292932] object-cover ${
                  isFirst ? "border-2 border-[#ffd166]" : "border-2 border-[#464554]"
                }`}
              />
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate font-extrabold text-[#e4e1ed]">
                  {leader.name}
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${positionChangeStyles[leader.positionChange].className}`}
                  title={positionChangeStyles[leader.positionChange].label}
                  aria-label={positionChangeStyles[leader.positionChange].label}
                >
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                    {positionChangeStyles[leader.positionChange].icon}
                  </span>
                </span>
              </div>
            </div>

            <div className="shrink-0 rounded-lg bg-[#4ae176]/10 px-2 py-1 font-extrabold text-[#4ae176]">
              +{leader.points} pkt
            </div>
          </motion.div>
        );
      })}
    </motion.section>
  );
}

export default RoundLeadersList;
