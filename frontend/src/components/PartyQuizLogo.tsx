import { Link } from "react-router-dom";

function PartyQuizLogo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label="Party Quiz">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c0c1ff] text-[#1000a9] shadow-[0_0_18px_rgba(192,193,255,0.28)]">
        <span className="h-4 w-4 rounded-[4px] border-[5px] border-current border-t-transparent border-l-transparent" />
      </div>
      <span className="bg-gradient-to-r from-[#5aa7ff] via-[#a879ff] to-[#ff3f87] bg-clip-text text-xl font-extrabold text-transparent">
        Party Quiz
      </span>
    </Link>
  );
}

export default PartyQuizLogo;
