import { describe, it, expect } from 'vitest';

import questionsReducer, {
  setQuestions,
  nextQuestion,
} from '../core/store/questionsSlice';
import type { QuestionsState } from '../core/store/types';

describe('questions slice', () => {
  const initialState: QuestionsState = {
    list: [],
    currentIndex: 0,
    results: null,
    loading: false,
  };

  it('setQuestions получает список вопросов', () => {
    const mockQuestions = [{ id: 1, text: 'Test' }];
    const action = setQuestions(mockQuestions);
    const result = questionsReducer(initialState, action);

    expect(result.list).toEqual(mockQuestions);
  });

  it('должен существовать и вызываться nextQuestion', () => {
    const action = nextQuestion();
    const result = questionsReducer(initialState, action);

    expect(result).toBeDefined();
  });
});
