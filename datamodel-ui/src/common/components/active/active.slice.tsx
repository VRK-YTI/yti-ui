import { AppState, AppThunk } from '@app/store';
import { createSlice } from '@reduxjs/toolkit';

const initialState: string[] = [];

export const activeSlice = createSlice({
  name: 'active',
  initialState: {
    identifiers: initialState,
  },
  reducers: {
    setActive(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export function selectActive() {
  return (state: AppState) => state.active;
}

export function setActive(data: string[]): AppThunk {
  return (dispatch) =>
    dispatch(activeSlice.actions.setActive({ identifiers: data }));
}

export function resetActive(): AppThunk {
  return (dispatch) =>
    dispatch(activeSlice.actions.setActive({ identifiers: [] }));
}
