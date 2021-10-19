import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../../../store';

export interface SearchState {
  value: string
};

const initialState: SearchState = {
  value: ''
};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    }
  }
})

export const { setFilter } = terminologySearchSlice.actions;

export const selectFilter = (state: AppState) => state.terminologySearch.value;

export default terminologySearchSlice.reducer;

