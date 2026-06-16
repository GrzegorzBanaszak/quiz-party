export type AnswerTone = "primary" | "secondary" | "tertiary" | "error";

export type QuestionAnswer = {
  letter: string;
  answer: string;
  tone: AnswerTone;
};

export const questionRevealDelayMs = 2500;
export const totalQuestionSeconds = 12;
export const totalQuestionPlayers = 12;

export const currentQuestion = {
  index: 1,
  total: 15,
  text: "Która planeta jest znana jako Czerwona Planeta?",
  correctAnswerLetter: "B",
  answers: [
    { letter: "A", answer: "Wenus", tone: "primary" },
    { letter: "B", answer: "Mars", tone: "secondary" },
    { letter: "C", answer: "Jowisz", tone: "tertiary" },
    { letter: "D", answer: "Saturn", tone: "error" },
  ] satisfies QuestionAnswer[],
};

export function getCorrectAnswer() {
  const correctAnswer = currentQuestion.answers.find(
    (answer) => answer.letter === currentQuestion.correctAnswerLetter,
  );

  if (!correctAnswer) {
    throw new Error("Correct answer is missing from the question answers.");
  }

  return correctAnswer;
}
