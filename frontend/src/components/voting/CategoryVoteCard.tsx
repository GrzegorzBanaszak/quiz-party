import type { CategoryTone, VotingCategory } from "../../lib/votingCategories";

type CategoryVoteCardProps = {
  category: VotingCategory;
  isSelected: boolean;
  onSelect: (categoryTitle: string) => void;
};

const toneStyles: Record<
  CategoryTone,
  {
    iconBackground: string;
    text: string;
  }
> = {
  primary: {
    iconBackground: "bg-[#c0c1ff]/18",
    text: "text-[#c0c1ff]",
  },
  tertiary: {
    iconBackground: "bg-[#4ae176]/18",
    text: "text-[#4ae176]",
  },
  secondary: {
    iconBackground: "bg-[#ffb2b7]/18",
    text: "text-[#ffb2b7]",
  },
};

function CategoryVoteCard({
  category,
  isSelected,
  onSelect,
}: CategoryVoteCardProps) {
  const styles = toneStyles[category.tone];

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(category.title)}
      className={`group flex min-h-[96px] w-full items-center gap-5 rounded-[1.65rem] border px-5 text-left shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition duration-200 hover:-translate-y-0.5 hover:border-[#c0c1ff]/60 hover:bg-[#292932] focus:ring-4 focus:ring-[#c0c1ff]/20 focus:outline-none ${
        isSelected
          ? "border-[#c0c1ff] bg-[#2a2a3a] shadow-[0_0_24px_rgba(192,193,255,0.28),0_1px_0_rgba(255,255,255,0.08)_inset]"
          : "border-[#464554] bg-[#1f1f27]/92"
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${styles.iconBackground} ${
          isSelected ? "ring-2 ring-[#c0c1ff]/55" : ""
        }`}
      >
        <span
          className={`material-symbols-outlined text-3xl ${styles.text}`}
          data-weight="fill"
          aria-hidden="true"
        >
          {category.icon}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[22px] leading-tight font-extrabold tracking-normal text-[#e4e1ed]">
            {category.title}
          </h2>
          {isSelected ? (
            <span
              className="material-symbols-outlined text-xl text-[#c0c1ff]"
              data-weight="fill"
              aria-hidden="true"
            >
              check_circle
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm leading-snug font-medium text-[#c7c4d7]">
          {category.description}
        </p>
      </div>
    </button>
  );
}

export default CategoryVoteCard;
