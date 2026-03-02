import { configureStore } from '@reduxjs/toolkit';

import authReducer from './authSlice';
import questionsReducer from './questionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
  },
});

/*
Использование 
  import { store } from '../../../core/store/Store';

  store.dispatch(increment());

  или

  store.subscribe(() => {
});

*/
