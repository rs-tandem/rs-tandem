export interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
}

export interface CheckAnswerResponse {
  correct: boolean;
  explanation: string;
}

export interface CheckAnswerPayload {
  questionId: number;
  answerIndex: number;
}
