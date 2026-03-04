export interface AuthState {
  user: { id: string; email: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
}

export interface Results {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  answers?: {
    questionId: number;
    selectedOption: number | string;
    isCorrect: boolean;
  }[];
}

export interface QuestionsState {
  list: Question[];
  currentIndex: number;
  results: Results | null;
  loading: boolean;
}
