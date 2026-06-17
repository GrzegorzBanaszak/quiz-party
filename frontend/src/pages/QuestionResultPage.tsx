import { useEffect, useState } from "react";
import { motion } from "motion/react";
import LobbyHeader from "../components/LobbyHeader";
import AnswerResultCard from "../components/question-result/AnswerResultCard";
import NextQuestionProgress from "../components/question-result/NextQuestionProgress";
import QuestionResultBackground from "../components/question-result/QuestionResultBackground";
import RoundLeadersList from "../components/question-result/RoundLeadersList";
import RoundResultHeading from "../components/question-result/RoundResultHeading";
import { useGameSession } from "../game/GameSessionContext";
import { mapAnswers, mapLeaderboardToRoundLeaders } from "../game/gameUiMappers";

const nextQuestionSeconds = 10;

function QuestionResultPage() {
  const { snapshot, localPlayer, session } = useGameSession();
  const [secondsLeft, setSecondsLeft] = useState(nextQuestionSeconds);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  if (!snapshot?.lastQuestionResult) {
    return null;
  }

  const sourceAnswers = snapshot.currentQuestion?.answers ?? [];
  const mappedAnswers = mapAnswers(sourceAnswers);
  const localPlayerId = localPlayer?.id ?? session?.playerId;
  const localPlayerResult = snapshot.lastQuestionResult.playerResults.find(
    (result) => result.playerId === localPlayerId,
  );

  function getMappedAnswer(answerId: string | null | undefined) {
    const answerIndex = sourceAnswers.findIndex(
      (answer) => answer.id === answerId,
    );

    return answerIndex >= 0 ? mappedAnswers[answerIndex] : null;
  }

  const selectedAnswer = getMappedAnswer(localPlayerResult?.selectedAnswerId) ?? {
    letter: "",
    answer: "No answer selected",
    tone: "error" as const,
  };
  const correctAnswer = getMappedAnswer(snapshot.lastQuestionResult.correctAnswerId) ?? {
    letter: "",
    answer: snapshot.lastQuestionResult.correctAnswerText,
    tone: "tertiary" as const,
  };
  const isCorrect = localPlayerResult?.isCorrect ?? false;
  const leaders = mapLeaderboardToRoundLeaders(
    snapshot.lastQuestionResult.leaderboard,
    snapshot.players,
    snapshot.lastQuestionResult.playerResults,
  );

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] pb-24 text-[#e4e1ed]">
      <QuestionResultBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <LobbyHeader
          playerName={localPlayer?.name}
          playerScore={localPlayer?.score}
          playerAvatar={localPlayer?.avatar}
        />

        <motion.section
          className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-4 py-10 md:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <RoundResultHeading
            questionIndex={snapshot.currentQuestionIndex}
            totalQuestions={snapshot.settings.questionsPerRound}
          />

          <AnswerResultCard
            answer={selectedAnswer}
            correctAnswer={correctAnswer}
            isCorrect={isCorrect}
          />

          <RoundLeadersList leaders={leaders} />
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
