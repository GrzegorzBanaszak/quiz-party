import { useGameSession } from "../game/GameSessionContext";

const statusLabels = {
  idle: "",
  connecting: "Laczenie z pokojem...",
  connected: "",
  reconnecting: "Przywracamy polaczenie...",
  offline: "Brak polaczenia. Po powrocie odswiezymy stan gry.",
};

function ConnectionStatusBanner() {
  const { connectionStatus, error, clearError } = useGameSession();
  const statusLabel = statusLabels[connectionStatus];

  if (!statusLabel && !error) {
    return null;
  }

  return (
    <div className="fixed inset-x-3 top-3 z-50 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-2xl border border-[#c0c1ff]/25 bg-[#1f1f27]/95 px-4 py-3 text-sm font-bold text-[#e4e1ed] shadow-xl backdrop-blur-xl">
      <span>{error ?? statusLabel}</span>
      {error ? (
        <button
          type="button"
          onClick={clearError}
          className="rounded-full bg-white/10 px-3 py-1 text-xs font-extrabold text-[#c0c1ff] transition hover:bg-white/15"
        >
          OK
        </button>
      ) : null}
    </div>
  );
}

export default ConnectionStatusBanner;
