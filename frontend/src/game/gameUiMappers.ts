import type {
  Answer,
  Category,
  Player,
  PlayerQuestionResult,
  ScoreEntry,
} from "../api/gameTypes";
import type { QuestionAnswer } from "../lib/question";
import type { CategoryTone, VotingCategory } from "../lib/votingCategories";
import type { RoundLeader } from "../lib/questionResults";
import type { FinalStanding } from "../lib/gameOver";
import { getAvatarUrl } from "../lib/avatars";

const answerTones = ["primary", "secondary", "tertiary", "error"] as const;

const categoryStyles: Record<
  string,
  { icon: string; tone: CategoryTone }
> = {
  history: { icon: "account_balance", tone: "tertiary" },
  science: { icon: "science", tone: "secondary" },
  "pop-culture": { icon: "movie", tone: "primary" },
  geography: { icon: "public", tone: "primary" },
};

export function mapAnswers(answers: Answer[]): QuestionAnswer[] {
  return answers.map((answer, index) => ({
    letter: answer.letter,
    answer: answer.text,
    tone: answerTones[index % answerTones.length],
  }));
}

export function mapCategories(
  categories: Category[],
  voteCounts: Record<string, number>,
): VotingCategory[] {
  return categories.map((category, index) => {
    const style = categoryStyles[category.id] ?? {
      icon: "category",
      tone: answerTones[index % 3] as CategoryTone,
    };

    return {
      id: category.id,
      title: category.name,
      description: category.description,
      icon: style.icon,
      votes: voteCounts[category.id] ?? 0,
      tone: style.tone,
    };
  });
}

export function mapLeaderboardToRoundLeaders(
  leaderboard: ScoreEntry[],
  players: Player[],
  playerResults: PlayerQuestionResult[] = [],
): RoundLeader[] {
  return leaderboard.slice(0, 5).map((entry) => {
    const player = players.find((candidate) => candidate.id === entry.playerId);
    const result = playerResults.find(
      (candidate) => candidate.playerId === entry.playerId,
    );

    return {
      rank: entry.rank,
      name: entry.playerName,
      pointsGained: result?.pointsGained ?? 0,
      totalPoints: entry.points,
      positionChange:
        entry.rankChange > 0 ? "up" : entry.rankChange < 0 ? "down" : "same",
      avatar: player?.avatar ?? getAvatarUrl(entry.playerName, "5aa7ff"),
    };
  });
}

export function mapLeaderboardToFinalStandings(
  leaderboard: ScoreEntry[],
  players: Player[],
): FinalStanding[] {
  return leaderboard.map((entry) => {
    const player = players.find((candidate) => candidate.id === entry.playerId);

    return {
      rank: entry.rank,
      name: entry.playerName,
      points: entry.points,
      avatar: player?.avatar ?? getAvatarUrl(entry.playerName, "5aa7ff"),
    };
  });
}
