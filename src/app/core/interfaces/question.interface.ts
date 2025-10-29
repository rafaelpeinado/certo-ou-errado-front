export interface Question {
  id: number,
  phrase: string;
  isCorrect: boolean;
  correctPhrase?: string;
}
