import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState, AppThunk } from '@app/store';

export interface ReduxCookies {
  JSESSIONID?: string;
}

export const initialState: ReduxCookies = {
  JSESSIONID: '',
};

export const reduxCookiesSlice = createSlice({
  name: 'reduxCookies',
  initialState,
  reducers: {
    setReduxCookies(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.reduxCookies,
      };
    },
  },
});

export function setReduxCookies(cookies: ReduxCookies): AppThunk {
  return (dispatch) =>
    dispatch(reduxCookiesSlice.actions.setReduxCookies(cookies));
}

export function selectReduxCookie(key: string) {
  return (state: AppState): string | undefined => state.reduxCookies[key];
}

export function selectReduxCookies() {
  return (state: AppState): ReduxCookies => state.reduxCookies;
}

export default reduxCookiesSlice.reducer;
