type VotingTimerProps = {
  secondsLeft: number;
  totalSeconds: number;
};

function VotingTimer({ secondsLeft, totalSeconds }: VotingTimerProps) {
  const timerPercentage = (secondsLeft / totalSeconds) * 100;
  const isEnding = secondsLeft <= 5;

  return (
    <div className="mx-auto mt-5 flex w-full max-w-[260px] flex-col items-center">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`material-symbols-outlined text-3xl ${isEnding ? "text-[#ffb4ab]" : "text-[#ffb2b7]"}`}
          aria-hidden="true"
        >
          timer
        </span>
        <span
          className={`text-4xl leading-none font-extrabold tabular-nums ${isEnding ? "text-[#ffb4ab]" : "text-[#ffb2b7]"}`}
        >
          {secondsLeft}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#34343d]">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isEnding ? "bg-[#ffb4ab]" : "bg-[#ffb2b7]"}`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default VotingTimer;
