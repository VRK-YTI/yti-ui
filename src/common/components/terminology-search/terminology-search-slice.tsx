import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import type { AppState, AppThunk } from '../../../store';
import { TerminologySearchResult } from '../../interfaces/terminology.interface';

export interface SearchState {
  value: string;
};

const initialState: SearchState = {
  value: '',
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
      // console.log('hydrating', state, action.payload);
      console.log('hydrating');
      return {
        ...state,
        ...action.payload.terminologySearch,
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
    // this request does not work yet but can be used as boilerplate for later post requests
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


// TODO: This can be deleted. Used only for testing
export const updateValue = (filter: any): AppThunk => async dispatch => {
  const timeoutPromise = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

  await timeoutPromise(500);

  dispatch(
    terminologySearchSlice.actions.setFilter({filter}),
  );
};

export const { useGetSearchResultQuery, useGetResultQuery } = terminologySearchApi;

export const setFilter = (filter: string): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter({
      value: filter
    }),
  );
};

export const selectFilter = () => (state: AppState): string => state.terminologySearch.value;
export default terminologySearchSlice.reducer;
