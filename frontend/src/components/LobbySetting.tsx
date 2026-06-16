export type LobbySettingTone = "primary" | "secondary" | "tertiary";

type LobbySettingProps = {
  icon: "category" | "quiz" | "timer";
  label: string;
  tone: LobbySettingTone;
};

function LobbySetting({ icon, label, tone }: LobbySettingProps) {
  const toneClassName = {
    primary: "text-[#c0c1ff]",
    secondary: "text-[#ffb2b7]",
    tertiary: "text-[#4ae176]",
  }[tone];

  return (
    <div className="flex items-center gap-2 rounded-xl bg-[#34343d] px-3 py-2 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
      <span
        className={`material-symbols-outlined text-[18px] ${toneClassName}`}
        data-icon={icon}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="text-sm font-extrabold text-[#e4e1ed]">{label}</span>
    </div>
  );
}

export default LobbySetting;
