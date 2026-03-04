import { createSlice } from '@reduxjs/toolkit';

import { type QuestionsState } from './types';

const initialState: QuestionsState = {
  list: [],
  currentIndex: 0,
  results: null,
  loading: false,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action) => ({
      ...state,
      list: action.payload,
    }),

    nextQuestion: (state) => ({
      ...state,
      // TBD
    }),
  },
});

export const { setQuestions, nextQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;
