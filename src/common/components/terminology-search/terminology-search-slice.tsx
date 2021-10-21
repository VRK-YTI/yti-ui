import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import type { AppState, AppThunk } from '../../../store';
import { TerminologyDTO } from '../../interfaces/terminology.interface';

export interface SearchState {
  value: string;
  results: TerminologyDTO;
};

const initialState: SearchState = {
  value: '',
  results: {
    id: '',
    code: null,
    uri: null,
    status: null,
    label: {key: ''},
    description: {},
    informationDomainDTO: null,
    contributors: null,
  },
};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {
    setFilter(state, action) {
      console.log('Here', action, state);
      return action.payload;
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.terminologySearch,
      };
    }
  }
});

export const setFilter = (filter: string): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter({
      value: filter
    }),
  );
};

export const selectFilter = () => (state: AppState): string => state.terminologySearch.value;

