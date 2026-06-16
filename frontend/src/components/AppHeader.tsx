import { Link } from "react-router-dom";

function AppHeader() {
  return (
    <header className="h-10 border-b border-white/10 bg-[#181820]/95">
      <div className="mx-auto flex h-full max-w-[1200px] items-center px-5">
        <Link
          to="/"
          className="relative text-sm font-extrabold text-transparent uppercase"
          aria-label="Party Quiz"
        >
          <span className="bg-gradient-to-r from-[#5aa7ff] via-[#a879ff] to-[#ff3f87] bg-clip-text">
            Party Quiz
          </span>
        </Link>
      </div>
    </header>
  );
}

export default AppHeader;
