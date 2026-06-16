import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { avatarBackgroundColors, avatarSeeds } from "../lib/avatars";
import AvatarPicker from "./AvatarPicker";

type PlayerFormMode = "create" | "join";

type PlayerFormProps = {
  mode: PlayerFormMode;
};

function PlayerForm({ mode }: PlayerFormProps) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarSeeds[0]);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    avatarBackgroundColors[0],
  );

  const isJoining = mode === "join";
  const title = isJoining ? "Join the Fun" : "Create a Room";
  const subtitle = isJoining
    ? "Get ready to clash with your friends!"
    : "Pick your nickname and start hosting.";
  const submitLabel = isJoining ? "Join Room" : "Create Room";
  const footerText = isJoining
    ? "Hosting a game instead?"
    : "Have a room code?";
  const footerAction = isJoining ? "Create one here" : "Join one here";
  const switchPath = isJoining ? "/create" : "/join";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/lobby");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#13131b] font-sans text-[#e4e1ed]">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(70,45,92,0.48)_0%,rgba(30,29,42,0.78)_34%,rgba(13,13,21,1)_78%)]" />
      <div className="fixed top-20 right-[8%] h-28 w-28 rotate-12 rounded-[2rem] border-[12px] border-[#c0c1ff]/20 floating" />
      <div className="fixed bottom-20 left-[8%] h-24 w-24 rounded-full border-[12px] border-[#ffb2b7]/20 floating-delayed" />

      <div className="relative z-10 flex min-h-screen flex-col items-center">
        <nav className="flex w-full max-w-[1200px] items-center justify-between px-4 py-6 lg:px-6">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex h-11 items-center gap-2 rounded-full px-1 text-[#c7c4d7] transition hover:text-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/20 focus:outline-none"
          >
            <span className="text-3xl leading-none transition group-hover:-translate-x-0.5">
              &larr;
            </span>
            <span className="text-sm font-extrabold tracking-[0.18em] uppercase">
              Back
            </span>
          </button>

          <div className="flex items-center gap-3">
            <div className="relative text-sm font-extrabold text-transparent uppercase">
              <span className="text-lg font-extrabold bg-gradient-to-r from-[#5aa7ff] via-[#a879ff] to-[#ff3f87] bg-clip-text">
                Party Quiz
              </span>
            </div>
          </div>

          <div className="w-[76px]" />
        </nav>

        <section className="flex w-full flex-1 items-center justify-center px-4 pb-10">
          <form
            onSubmit={handleSubmit}
            className="relative flex w-full max-w-[520px] flex-col gap-6 rounded-[2rem] border border-white/10 bg-[#1f1f27]/75 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
          >
            <div className="pointer-events-none absolute -top-12 right-6 h-28 w-28 rotate-12 rounded-[2rem] border-[12px] border-[#8083ff]/22" />

            <div className="relative text-center">
              <h1 className="text-2xl font-black text-[#e4e1ed]">{title}</h1>
              <p className="mt-2 text-lg font-medium text-[#c7c4d7]">
                {subtitle}
              </p>
            </div>

            <div className="relative flex flex-col gap-6">
              {isJoining && (
                <label className="flex flex-col gap-3">
                  <span className="flex items-center justify-between px-1">
                    <span className="text-sm font-bold tracking-wide text-[#c0c1ff] uppercase">
                      Room Code
                    </span>
                    <span className="text-xs font-medium text-[#c7c4d7]">
                      Ask the host
                    </span>
                  </span>
                  <input
                    value={roomCode}
                    onChange={(event) =>
                      setRoomCode(
                        event.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .toUpperCase()
                          .slice(0, 4),
                      )
                    }
                    className="h-16 rounded-full border-2 border-[#555464] bg-[#0d0d15] px-6 text-center text-3xl font-black tracking-[0.45em] text-white transition placeholder:text-[#464554] focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/20 focus:outline-none"
                    inputMode="text"
                    maxLength={4}
                    placeholder="0000"
                  />
                </label>
              )}

              <label className="flex flex-col gap-3">
                <span className="px-1 text-sm font-bold tracking-wide text-[#c0c1ff] uppercase">
                  Player Nickname
                </span>
                <input
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  className="h-14 rounded-full border-2 border-[#555464] bg-[#0d0d15] px-6 text-lg font-extrabold text-white transition placeholder:text-white focus:border-[#c0c1ff] focus:ring-4 focus:ring-[#c0c1ff]/20 focus:outline-none"
                  maxLength={24}
                  placeholder="Enter your name"
                />
              </label>

              <AvatarPicker
                selectedAvatar={selectedAvatar}
                selectedBackgroundColor={selectedBackgroundColor}
                onSelectAvatar={setSelectedAvatar}
                onSelectBackgroundColor={setSelectedBackgroundColor}
              />

              <button
                type="submit"
                className="mt-2 flex h-16 w-full items-center justify-center gap-3 rounded-full bg-[#c0c1ff] px-8 text-xl font-black text-[#1000a9] shadow-[0_0_24px_rgba(192,193,255,0.36),0_16px_36px_rgba(91,81,255,0.22)] transition hover:bg-[#d2d2ff] focus:ring-4 focus:ring-[#c0c1ff]/35 focus:outline-none active:scale-[0.98]"
              >
                {submitLabel}
                <span aria-hidden="true">-&gt;</span>
              </button>
            </div>

            <div className="border-t border-[#464554]/45 pt-4 text-center">
              <p className="text-xs font-extrabold tracking-[0.14em] text-[#c7c4d7] uppercase">
                {footerText}
                <button
                  type="button"
                  onClick={() => navigate(switchPath)}
                  className="ml-2 text-[#c0c1ff] transition hover:text-white hover:underline focus:outline-none"
                >
                  {footerAction}
                </button>
              </p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default PlayerForm;
