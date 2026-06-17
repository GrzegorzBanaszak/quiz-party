import PartyQuizLogo from "./PartyQuizLogo";

function AppHeader() {
  return (
    <header className="h-10 border-b border-white/10 bg-[#181820]/95">
      <div className="mx-auto flex h-full max-w-[1200px] items-center px-5">
        <div className="scale-75 origin-left">
          <PartyQuizLogo />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
