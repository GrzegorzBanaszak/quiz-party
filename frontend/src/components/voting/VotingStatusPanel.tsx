type VotingStatusPanelProps = {
  totalVotes: number;
};

function VotingStatusPanel({ totalVotes }: VotingStatusPanelProps) {
  return (
    <div className="mx-auto mt-10 flex max-w-full flex-col items-center gap-4 rounded-[2rem] border border-white/5 bg-[#1b1b23]/70 px-6 py-4 backdrop-blur-sm md:flex-row md:gap-8 md:rounded-full md:px-10">
      <div className="flex items-center gap-3 text-[#c7c4d7]">
        <span className="material-symbols-outlined text-[#c0c1ff]" aria-hidden="true">
          smartphone
        </span>
        <span className="text-base font-medium md:text-lg">
          Gracze oddają głosy na swoich urządzeniach
        </span>
      </div>
      <div className="hidden h-6 w-px bg-white/10 md:block" />
      <div className="flex items-center gap-3 text-[#c7c4d7]">
        <span className="material-symbols-outlined text-[#4ae176]" aria-hidden="true">
          check_circle
        </span>
        <span className="text-base font-medium md:text-lg">
          <strong className="text-[#e4e1ed]">{totalVotes}</strong> graczy
          zagłosowało
        </span>
      </div>
    </div>
  );
}

export default VotingStatusPanel;
