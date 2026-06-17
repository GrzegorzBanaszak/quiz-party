import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LobbyHeader from "../components/LobbyHeader";
import QuestionAnswersGrid from "../components/question/QuestionAnswersGrid";
import QuestionBackground from "../components/question/QuestionBackground";
import QuestionProgressFooter from "../components/question/QuestionProgressFooter";
import QuestionPromptCard from "../components/question/QuestionPromptCard";
import QuestionTimer from "../components/question/QuestionTimer";
import { useGameSession } from "../game/GameSessionContext";
import { mapAnswers } from "../game/gameUiMappers";

const questionIntroMs = 5_000;

function QuestionPage() {
  const {
    snapshot,
    localPlayer,
    selectedAnswerId,
    submitAnswer,
    connectionStatus,
  } = useGameSession();
  const question = snapshot?.currentQuestion;
  const totalQuestionSeconds = question?.timeLimitSeconds ?? 12;
  const [secondsLeft, setSecondsLeft] = useState(totalQuestionSeconds);
  const [elapsedMs, setElapsedMs] = useState(0);
  const answers = useMemo(
    () => mapAnswers(question?.answers ?? []),
    [question?.answers],
  );
  const selectedAnswerLetter =
    question?.answers.find((answer) => answer.id === selectedAnswerId)?.letter ??
    null;
  const questionStartedAtMs = snapshot?.questionStartedAtUtc
    ? new Date(snapshot.questionStartedAtUtc).getTime()
    : null;
  const answerStartedAtMs =
    questionStartedAtMs === null ? null : questionStartedAtMs + questionIntroMs;
  const areAnswersVisible =
    questionStartedAtMs !== null && elapsedMs >= questionIntroMs;

  useEffect(() => {
    if (!questionStartedAtMs || !question) {
      return;
    }

    function updateQuestionClock() {
      const nextElapsedMs = Math.max(Date.now() - questionStartedAtMs!, 0);
      const answerElapsedSeconds =
        nextElapsedMs < questionIntroMs
          ? 0
          : Math.floor((nextElapsedMs - questionIntroMs) / 1000);

      setElapsedMs(nextElapsedMs);
      setSecondsLeft(Math.max(totalQuestionSeconds - answerElapsedSeconds, 0));
    }

    updateQuestionClock();
    const timer = window.setInterval(updateQuestionClock, 250);

    return () => window.clearInterval(timer);
  }, [question, questionStartedAtMs, totalQuestionSeconds]);

  function handleSelectAnswer(letter: string) {
    if (
      !question ||
      answerStartedAtMs === null ||
      !areAnswersVisible ||
      connectionStatus !== "connected"
    ) {
      return;
    }

    const answer = question.answers.find((candidate) => candidate.letter === letter);
    if (!answer || selectedAnswerId) {
      return;
    }

    const answeredAtMs = Math.max(
      Date.now() - answerStartedAtMs,
      0,
    );

    void submitAnswer(answer.id, answeredAtMs);
  }

  if (!snapshot || !question) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <QuestionBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader
          playerName={localPlayer?.name}
          playerScore={localPlayer?.score}
          playerAvatar={localPlayer?.avatar}
        />

        <motion.section
          layout
          className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center gap-10 px-4 py-8 md:px-6 md:py-12"
          transition={{ layout: { type: "spring", stiffness: 240, damping: 30 } }}
        >
          <AnimatePresence>
            {areAnswersVisible ? (
              <QuestionTimer
                key="question-timer"
                secondsLeft={secondsLeft}
                totalSeconds={totalQuestionSeconds}
              />
            ) : null}
          </AnimatePresence>

          <QuestionPromptCard
            label={
              !areAnswersVisible
                ? "Czytaj pytanie"
                : selectedAnswerId
                ? "Odpowiedz zapisana"
                : `Pytanie ${snapshot.currentQuestionIndex} / ${snapshot.settings.questionsPerRound}`
            }
            question={question.text}
            isActive={areAnswersVisible}
          />

          <AnimatePresence>
            {areAnswersVisible ? (
              <QuestionAnswersGrid
                key="question-answers"
                answers={answers}
                selectedAnswer={selectedAnswerLetter}
                onSelectAnswer={handleSelectAnswer}
              />
            ) : null}
          </AnimatePresence>
        </motion.section>

        <AnimatePresence>
          {areAnswersVisible ? (
            <QuestionProgressFooter
              key="question-progress"
              answeredPlayers={snapshot.answeredCount}
              totalPlayers={snapshot.totalPlayers}
              selectedAnswer={selectedAnswerLetter}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default QuestionPage;
