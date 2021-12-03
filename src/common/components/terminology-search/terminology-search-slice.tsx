import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import type { AppState, AppThunk } from '../../../store';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';

export interface SearchState {
  searchFilter: {
    filter: string;
    resultStart: number;
  };
};

const initialState: SearchState = {
  searchFilter: {
    filter: '',
    resultStart: 0
  }
};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.searchFilter.filter = action.payload;
    },
    setResultStart(state, action) {
      state.searchFilter.resultStart = action.payload;
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.terminologySearch,
      };
    },
  }
});

export const terminologySearchApi = createApi({
  reducerPath: 'terminologySearchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['TerminologySearch'],
  endpoints: builder => ({
    getSearchResult: builder.query<TerminologySearchResult, {filter: string, resultStart: number}>({
      query: (value) => ({
        url: '/searchTerminology',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: {
          query: value.filter,
          searchConcepts: true,
          prefLang: 'fi',
          pageSize: 2,
          pageFrom: value.resultStart,
        },
      }),
    }),
  }),
});

export const { useGetSearchResultQuery } = terminologySearchApi;

export const setFilter = (filter: string): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter(filter),
  );
};

export const setResultStart = (resultStart: number): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setResultStart(resultStart),
  );
};

export const selectFilter = () => (state: AppState): string => state.terminologySearch.searchFilter.filter;
export const selectSearchFilter = () => (state: AppState): {filter: string, resultStart: number} => state.terminologySearch.searchFilter;

export default terminologySearchSlice.reducer;
