import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import type { AppState, AppThunk } from '../../../store';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';

export interface SearchState {
  filter: string;
};

const initialState: SearchState = {
  filter: ''
};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {
    setFilter(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },
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
    getSearchResult: builder.query<TerminologySearchResult, string>({
      query: (value) => ({
        url: '/searchTerminology',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: {
          query: value,
          searchConcepts: true,
          prefLang: 'fi',
          pageSize: 2,
          pageFrom: 0,
        },
      }),
    }),
  }),
});

export const { useGetSearchResultQuery } = terminologySearchApi;

export const setFilter = (filter: string): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter({
      filter: filter
    }),
  );
};

export const selectFilter = () => (state: AppState): string => state.terminologySearch.filter;
export default terminologySearchSlice.reducer;
