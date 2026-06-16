import { motion } from "motion/react";
import type { AnswerTone } from "../../lib/question";

type AnswerOptionCardProps = {
  letter: string;
  answer: string;
  tone: AnswerTone;
  isSelected: boolean;
  onSelect: (letter: string) => void;
};

const toneStyles: Record<
  AnswerTone,
  {
    overlay: string;
    border: string;
    text: string;
    shadow: string;
    selectedBackground: string;
  }
> = {
  primary: {
    overlay: "bg-[#c0c1ff]/10",
    border: "border-[#c0c1ff]",
    text: "text-[#c0c1ff]",
    shadow: "shadow-[0_12px_32px_-8px_rgba(192,193,255,0.42)]",
    selectedBackground: "bg-[#c0c1ff]/12",
  },
  secondary: {
    overlay: "bg-[#ffb2b7]/10",
    border: "border-[#ffb2b7]",
    text: "text-[#ffb2b7]",
    shadow: "shadow-[0_12px_32px_-8px_rgba(255,178,183,0.42)]",
    selectedBackground: "bg-[#ffb2b7]/12",
  },
  tertiary: {
    overlay: "bg-[#4ae176]/10",
    border: "border-[#4ae176]",
    text: "text-[#4ae176]",
    shadow: "shadow-[0_12px_32px_-8px_rgba(74,225,118,0.42)]",
    selectedBackground: "bg-[#4ae176]/12",
  },
  error: {
    overlay: "bg-[#ffb4ab]/10",
    border: "border-[#ffb4ab]",
    text: "text-[#ffb4ab]",
    shadow: "shadow-[0_12px_32px_-8px_rgba(255,180,171,0.42)]",
    selectedBackground: "bg-[#ffb4ab]/12",
  },
};

function AnswerOptionCard({
  letter,
  answer,
  tone,
  isSelected,
  onSelect,
}: AnswerOptionCardProps) {
  const styles = toneStyles[tone];

  return (
    <motion.button
      type="button"
      layout
      aria-pressed={isSelected}
      onClick={() => onSelect(letter)}
      className={`group relative flex min-h-20 w-full items-center overflow-hidden rounded-[2rem] border-2 p-5 text-left shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-xl focus:ring-4 focus:ring-[#c0c1ff]/20 focus:outline-none ${
        isSelected
          ? `${styles.border} ${styles.selectedBackground} ${styles.shadow}`
          : "border-[#34343d] bg-[#1f1f27]/78"
      }`}
      whileHover={{ scale: 1.025, y: -3 }}
      whileTap={{ scale: 0.97 }}
      animate={{
        boxShadow: isSelected
          ? "0 14px 34px -10px rgba(192,193,255,0.42)"
          : "0 1px 0 rgba(255,255,255,0.06) inset",
      }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
    >
      <motion.div
        className={`absolute inset-0 ${styles.overlay}`}
        initial={false}
        animate={{ opacity: isSelected ? 1 : 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.18 }}
      />
      <div className="relative z-10 flex min-w-0 items-center gap-4">
        <motion.div
          layout
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-[#292932] ${
            isSelected ? styles.border : "border-[#464554]"
          }`}
          animate={{ rotate: isSelected ? [0, -8, 0] : 0, scale: isSelected ? 1.05 : 1 }}
          transition={{ duration: 0.24 }}
        >
          <span
            className={`text-2xl leading-none font-bold ${
              isSelected ? styles.text : "text-[#c7c4d7]"
            }`}
          >
            {letter}
          </span>
        </motion.div>
        <span className="truncate text-2xl leading-tight font-bold text-[#e4e1ed]">
          {answer}
        </span>
      </div>

      {isSelected ? (
        <motion.span
          className={`material-symbols-outlined relative z-10 ml-auto text-2xl ${styles.text}`}
          data-weight="fill"
          aria-hidden="true"
          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
        >
          check_circle
        </motion.span>
      ) : null}
    </motion.button>
  );
}

export default AnswerOptionCard;
