import { useEffect, useState } from "react";
import { motion } from "motion/react";
import LobbyHeader from "../components/LobbyHeader";
import CorrectAnswerCard from "../components/question-result/CorrectAnswerCard";
import NextQuestionProgress from "../components/question-result/NextQuestionProgress";
import QuestionResultBackground from "../components/question-result/QuestionResultBackground";
import RoundLeadersList from "../components/question-result/RoundLeadersList";
import RoundResultHeading from "../components/question-result/RoundResultHeading";
import { currentQuestion, getCorrectAnswer } from "../lib/question";
import { roundLeaders } from "../lib/questionResults";

const nextQuestionSeconds = 3;

function QuestionResultPage() {
  const [secondsLeft, setSecondsLeft] = useState(nextQuestionSeconds);
  const correctAnswer = getCorrectAnswer();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] pb-24 text-[#e4e1ed]">
      <QuestionResultBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader />

        <motion.section
          className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-4 py-10 md:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <RoundResultHeading
            questionIndex={currentQuestion.index}
            totalQuestions={currentQuestion.total}
          />

          <CorrectAnswerCard answer={correctAnswer} />

          <RoundLeadersList leaders={roundLeaders} />
        </motion.section>

        <NextQuestionProgress
          secondsLeft={secondsLeft}
          totalSeconds={nextQuestionSeconds}
        />
      </div>
    </main>
  );
}

export default QuestionResultPage;
