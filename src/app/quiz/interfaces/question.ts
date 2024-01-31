export interface Question {
  id: number;
  description: string;
  frequencyId: string;
}

export interface NextQuestionData {
  question: Question;
  index: number;
  value: number;
}
