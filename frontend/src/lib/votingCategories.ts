export type CategoryTone = "primary" | "tertiary" | "secondary";

export type VotingCategory = {
  id: string;
  title: string;
  description: string;
  icon: string;
  votes: number;
  tone: CategoryTone;
};

export const votingCategories: VotingCategory[] = [
  {
    id: "pop-culture",
    title: "Popkultura",
    description: "Filmy, muzyka i viralowe trendy",
    icon: "movie",
    votes: 12,
    tone: "primary",
  },
  {
    id: "history",
    title: "Historia",
    description: "Dawne imperia i wielkie wydarzenia",
    icon: "account_balance",
    votes: 18,
    tone: "tertiary",
  },
  {
    id: "science",
    title: "Nauka",
    description: "Kosmos, biologia i fizyka",
    icon: "science",
    votes: 6,
    tone: "secondary",
  },
];

export function getWinningCategory(categories: VotingCategory[]) {
  return categories.reduce((winner, category) =>
    category.votes > winner.votes ? category : winner,
  );
}
