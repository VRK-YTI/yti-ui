import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import type { AppState, AppThunk } from '../../../../store';
import { TerminologySearchResult } from '../../../interfaces/terminology.interface';

export interface SearchState {
  filter: string;
};

const initialState: SearchState = {
  filter: '',
};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {
    setFilter(state, action) {
      console.log('called');
      return {
        ...state,
        ...action.payload
      };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      console.log('hydrating', action.payload);
      return {
        ...state,
        ...action.payload.terminologySearch,
      };
    },

    // TODO: This can be deleted, currently as an example
    'setFilter': (state, action) => {
      return {
        ...state,
        ...action.payload
      };
    }
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
          pageSize: 10,
          pageFrom: 0,
        },
      }),
    }),
    // this isn't used but can be used as a boilerplate for later post requests
    getResult: builder.query<any, string>({
      query: (value) => ({
        url: '/request',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: {
          organizationId: value,
        },
      })
    })
  }),
});

export const { useGetSearchResultQuery, useGetResultQuery } = terminologySearchApi;

export const setFilter = (filter: string): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter({
      filter: filter
    }),
  );
};

export const selectFilter = () => (state: AppState): string => state.terminologySearch.filter;
export default terminologySearchSlice.reducer;
