import VotingTimer from "./VotingTimer";

type VotingHeroProps = {
  secondsLeft: number;
  totalSeconds: number;
};

function VotingHero({ secondsLeft, totalSeconds }: VotingHeroProps) {
  return (
    <div className="mb-10 text-center">
      <h1 className="text-[32px] leading-tight font-extrabold tracking-normal text-[#e4e1ed] md:text-5xl">
        Głosowanie na następną kategorię
      </h1>

      <VotingTimer secondsLeft={secondsLeft} totalSeconds={totalSeconds} />

      <div className="mt-4 flex items-center justify-center gap-3 text-[#c7c4d7]">
        <span className="material-symbols-outlined animate-pulse" aria-hidden="true">
          pending
        </span>
        <p className="text-lg font-medium">Czekamy na głosy graczy...</p>
      </div>
    </div>
  );
}

export default VotingHero;
