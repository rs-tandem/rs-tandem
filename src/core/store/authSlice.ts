import { createSlice } from '@reduxjs/toolkit';

import { type AuthState } from './types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  pageLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    loginSuccess: (state, action) => ({
      ...state,
      loading: false,
      user: action.payload,
      isAuthenticated: true,
      error: null,
    }),
    loginFailure: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    logout: () => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      pageLoading: false,
      error: null,
    }),
    setPageLoading: (state, action) => ({
      ...state,
      pageLoading: action.payload,
    }),
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setPageLoading,
} = authSlice.actions;
export default authSlice.reducer;
