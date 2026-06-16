import { motion, type Variants } from "motion/react";
import type { QuestionAnswer } from "../../lib/question";
import AnswerOptionCard from "./AnswerOptionCard";

type QuestionAnswersGridProps = {
  answers: QuestionAnswer[];
  selectedAnswer: string | null;
  onSelectAnswer: (letter: string) => void;
};

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const answerVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.94, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

function QuestionAnswersGrid({
  answers,
  selectedAnswer,
  onSelectAnswer,
}: QuestionAnswersGridProps) {
  return (
    <motion.div
      className="grid w-full max-w-4xl grid-cols-1 gap-5"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 16, transition: { duration: 0.18 } }}
    >
      {answers.map((answer) => (
        <motion.div key={answer.letter} className="w-full" variants={answerVariants}>
          <AnswerOptionCard
            letter={answer.letter}
            answer={answer.answer}
            tone={answer.tone}
            isSelected={selectedAnswer === answer.letter}
            onSelect={onSelectAnswer}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default QuestionAnswersGrid;
