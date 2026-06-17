import type { GameSettings } from "../api/gameTypes";
import LobbySetting from "./LobbySetting";

type LobbyFooterProps = {
  settings: GameSettings;
  isHost: boolean;
  isReady: boolean;
  canStart: boolean;
  isBusy: boolean;
  onReadyChange: (isReady: boolean) => void;
  onSettingsChange: (settings: Partial<GameSettings>) => void;
  onStartGame: () => void;
};

function LobbyFooter({
  settings,
  isHost,
  isReady,
  canStart,
  isBusy,
  onReadyChange,
  onSettingsChange,
  onStartGame,
}: LobbyFooterProps) {
  function handleSettingChange(key: keyof GameSettings, value: number) {
    onSettingsChange({ [key]: value });
  }

  return (
    <footer className="mt-auto border-t border-[#464554] bg-[#1f1f27]/70 p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] backdrop-blur-xl md:px-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            <LobbySetting
              icon="quiz"
              label={`${settings.questionsPerRound * settings.roundsCount} Questions`}
              tone="secondary"
            />
            <LobbySetting
              icon="category"
              label={`${settings.roundsCount} Rounds`}
              tone="primary"
            />
            <LobbySetting
              icon="timer"
              label={`${settings.answerTimeSeconds}s / Question`}
              tone="tertiary"
            />
          </div>

          {isHost ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SettingStepper
                icon="quiz"
                label="Questions"
                value={settings.questionsPerRound}
                min={1}
                max={5}
                disabled={isBusy}
                onChange={(value) => handleSettingChange("questionsPerRound", value)}
              />
              <SettingStepper
                icon="category"
                label="Rounds"
                value={settings.roundsCount}
                min={1}
                max={5}
                disabled={isBusy}
                onChange={(value) => handleSettingChange("roundsCount", value)}
              />
              <SettingStepper
                icon="timer"
                label="Seconds"
                value={settings.answerTimeSeconds}
                min={5}
                max={60}
                disabled={isBusy}
                onChange={(value) => handleSettingChange("answerTimeSeconds", value)}
              />
              <SettingStepper
                icon="groups"
                label="Players"
                value={settings.maxPlayers}
                min={1}
                max={24}
                disabled={isBusy}
                onChange={(value) => handleSettingChange("maxPlayers", value)}
              />
            </div>
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-3 md:w-auto">
          {!isHost ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onReadyChange(!isReady)}
              className={`flex h-14 w-full min-w-[200px] items-center justify-center gap-3 rounded-full px-8 text-lg font-black shadow-lg transition focus:ring-4 focus:ring-[#c0c1ff]/35 focus:outline-none active:scale-95 md:w-auto ${
                isReady
                  ? "bg-[#4ae176] text-[#003915] shadow-[#4ae176]/20"
                  : "bg-[#c0c1ff] text-[#1000a9] shadow-[#8083ff]/20 hover:bg-[#d2d2ff]"
              }`}
            >
              {isReady ? "Ready" : "Ready Up"}
            </button>
          ) : null}

          {isHost ? (
            <button
              type="button"
              disabled={!canStart || isBusy}
              onClick={onStartGame}
              className="flex h-14 w-full min-w-[200px] items-center justify-center gap-3 rounded-full bg-[#c0c1ff] px-8 text-lg font-black text-[#1000a9] shadow-lg shadow-[#8083ff]/20 transition hover:scale-105 hover:bg-[#d2d2ff] focus:ring-4 focus:ring-[#c0c1ff]/35 focus:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
            >
              Start Game
              <span
                className="material-symbols-outlined"
                data-icon="play_arrow"
                data-weight="fill"
                aria-hidden="true"
              >
                play_arrow
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

type SettingStepperProps = {
  icon: "category" | "groups" | "quiz" | "timer";
  label: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
};

function SettingStepper({
  icon,
  label,
  value,
  min,
  max,
  disabled,
  onChange,
}: SettingStepperProps) {
  const canDecrease = !disabled && value > min;
  const canIncrease = !disabled && value < max;

  function updateValue(nextValue: number) {
    onChange(Math.min(Math.max(nextValue, min), max));
  }

  return (
    <div
      className={`min-w-[170px] rounded-2xl border bg-[#13131b]/72 p-3 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] transition ${
        disabled
          ? "border-[#34343d] opacity-75"
          : "border-[#555464] hover:border-[#c0c1ff]/60 hover:bg-[#1b1b23]"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="material-symbols-outlined text-[18px] text-[#c0c1ff]"
            aria-hidden="true"
          >
            {icon}
          </span>
          <span className="truncate text-xs font-black tracking-[0.12em] text-[#c7c4d7] uppercase">
            {label}
          </span>
        </div>
        {!disabled ? (
          <span className="rounded-full bg-[#4ae176]/12 px-2 py-0.5 text-[10px] font-black text-[#4ae176] uppercase">
            Host
          </span>
        ) : null}
      </div>

      <div className="grid h-12 grid-cols-[40px_1fr_40px] items-center overflow-hidden rounded-xl border border-[#464554] bg-[#0d0d15]">
        <button
          type="button"
          disabled={!canDecrease}
          onClick={() => updateValue(value - 1)}
          className="flex h-full items-center justify-center text-[#c7c4d7] transition hover:bg-white/8 hover:text-white focus:ring-2 focus:ring-[#c0c1ff]/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-25"
          aria-label={`Decrease ${label}`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            remove
          </span>
        </button>

        <div className="flex h-full items-center justify-center border-x border-[#34343d] bg-[#1f1f27]/84">
          <span className="text-xl font-black tabular-nums text-[#e4e1ed]">
            {value}
          </span>
        </div>

        <button
          type="button"
          disabled={!canIncrease}
          onClick={() => updateValue(value + 1)}
          className="flex h-full items-center justify-center text-[#c7c4d7] transition hover:bg-white/8 hover:text-white focus:ring-2 focus:ring-[#c0c1ff]/40 focus:outline-none disabled:cursor-not-allowed disabled:opacity-25"
          aria-label={`Increase ${label}`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
            add
          </span>
        </button>
      </div>
    </div>
  );
}

export default LobbyFooter;
