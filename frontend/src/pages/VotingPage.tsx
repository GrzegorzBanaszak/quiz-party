import { useEffect, useMemo, useState } from "react";
import CategoryVoteCard from "../components/voting/CategoryVoteCard";
import VotingHeader from "../components/voting/VotingHeader";
import VotingHero from "../components/voting/VotingHero";
import VotingStatusPanel from "../components/voting/VotingStatusPanel";
import { useGameSession } from "../game/GameSessionContext";
import { mapCategories } from "../game/gameUiMappers";

const totalSeconds = 10;

function VotingPage() {
  const {
    snapshot,
    selectedCategoryId,
    voteCategory,
    connectionStatus,
  } = useGameSession();
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    function updateSecondsLeft() {
      if (!snapshot) {
        setSecondsLeft(totalSeconds);
        return;
      }

      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(snapshot.updatedAtUtc).getTime()) / 1000,
      );
      setSecondsLeft(Math.max(totalSeconds - elapsedSeconds, 0));
    }

    updateSecondsLeft();
    const timer = window.setInterval(() => {
      updateSecondsLeft();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [snapshot]);

  const categories = useMemo(
    () => mapCategories(snapshot?.categories ?? [], snapshot?.categoryVoteCounts ?? {}),
    [snapshot?.categories, snapshot?.categoryVoteCounts],
  );

  const totalVotes = useMemo(
    () => categories.reduce((sum, category) => sum + category.votes, 0),
    [categories],
  );

  if (!snapshot) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#13131b] text-[#e4e1ed]">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(128,131,255,0.16)_0%,rgba(31,31,39,0.58)_34%,rgba(13,13,21,1)_76%)]" />
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-[#292932]/70 to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <VotingHeader />

        <section className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-4 py-8 md:px-6 md:py-12">
          <VotingHero secondsLeft={secondsLeft} totalSeconds={totalSeconds} />

          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4">
            {categories.map((category) => (
              <CategoryVoteCard
                key={category.id}
                category={category}
                isSelected={selectedCategoryId === category.id}
                onSelect={(categoryId) => {
                  if (connectionStatus === "connected") {
                    void voteCategory(categoryId);
                  }
                }}
              />
            ))}
          </div>

          <VotingStatusPanel totalVotes={totalVotes} />
        </section>
      </div>
    </main>
  );
}

export default VotingPage;
