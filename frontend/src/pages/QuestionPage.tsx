import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LobbyHeader from "../components/LobbyHeader";
import QuestionAnswersGrid from "../components/question/QuestionAnswersGrid";
import QuestionBackground from "../components/question/QuestionBackground";
import QuestionProgressFooter from "../components/question/QuestionProgressFooter";
import QuestionPromptCard from "../components/question/QuestionPromptCard";
import QuestionTimer from "../components/question/QuestionTimer";
import {
  currentQuestion,
  questionRevealDelayMs,
  totalQuestionPlayers,
  totalQuestionSeconds,
} from "../lib/question";

function QuestionPage() {
  const [secondsLeft, setSecondsLeft] = useState(totalQuestionSeconds);
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answeredPlayers, setAnsweredPlayers] = useState(0);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setIsQuestionActive(true);
    }, questionRevealDelayMs);

    return () => window.clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (!isQuestionActive) {
      return;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isQuestionActive]);

  useEffect(() => {
    if (!isQuestionActive) {
      return;
    }

    const playersTimer = window.setInterval(() => {
      setAnsweredPlayers((current) => Math.min(current + 1, 8));
    }, 850);

    return () => window.clearInterval(playersTimer);
  }, [isQuestionActive]);

  function handleSelectAnswer(letter: string) {
    setSelectedAnswer(letter);
    setAnsweredPlayers((current) =>
      Math.min(Math.max(current, 9), totalQuestionPlayers),
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <QuestionBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader />

        <motion.section
          layout
          className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center gap-10 px-4 py-8 md:px-6 md:py-12"
          transition={{ layout: { type: "spring", stiffness: 240, damping: 30 } }}
        >
          <AnimatePresence>
            {isQuestionActive ? (
              <QuestionTimer
                key="question-timer"
                secondsLeft={secondsLeft}
                totalSeconds={totalQuestionSeconds}
              />
            ) : null}
          </AnimatePresence>

          <QuestionPromptCard
            label={
              isQuestionActive
                ? "Odpowiedz teraz"
                : `Pytanie ${currentQuestion.index} / ${currentQuestion.total}`
            }
            question={currentQuestion.text}
            isActive={isQuestionActive}
          />

          <AnimatePresence>
            {isQuestionActive ? (
              <QuestionAnswersGrid
                key="question-answers"
                answers={currentQuestion.answers}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={handleSelectAnswer}
              />
            ) : null}
          </AnimatePresence>
        </motion.section>

        <AnimatePresence>
          {isQuestionActive ? (
            <QuestionProgressFooter
              key="question-progress"
              answeredPlayers={answeredPlayers}
              totalPlayers={totalQuestionPlayers}
              selectedAnswer={selectedAnswer}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default QuestionPage;
