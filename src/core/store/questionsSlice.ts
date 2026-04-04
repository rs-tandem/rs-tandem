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

    setSessionResults: (state, action) => ({
      ...state,
      sessionResults: action.payload,
    }),
  },
});

export const {
  setQuestions,
  nextQuestion,
  setQuestionResult,
  resetSession,
  setSessionResults,
} = questionsSlice.actions;
export default questionsSlice.reducer;
