import { createSlice } from '@reduxjs/toolkit';

const questionsSlice = createSlice({
  name: 'questions',
  initialState: {
    list: [],
    currentIndex: 0,
    results: null,
    loading: false,
  },
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
