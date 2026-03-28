import { createSlice } from '@reduxjs/toolkit';

import { type QuestionsState } from './types';

const QUESTION_INDEX_INCREMENT = 1;

const initialState: QuestionsState = {
  list: [],
  currentIndex: 0,
  results: null,
  loading: false,
  sessionResults: {},
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action) => ({
      ...state,
      list: action.payload,
      sessionResults: {},
      currentIndex: 0,
    }),

    nextQuestion: (state) => ({
      ...state,
      currentIndex: state.currentIndex + QUESTION_INDEX_INCREMENT,
    }),

    setQuestionResult: (state, action) => ({
      ...state,
      sessionResults: {
        ...state.sessionResults,
        [action.payload.id]: action.payload.solved,
      },
    }),

    resetSession: (state) => ({
      ...state,
      sessionResults: {},
    }),
  },
});

export const { setQuestions, nextQuestion, setQuestionResult, resetSession } =
  questionsSlice.actions;
export default questionsSlice.reducer;
