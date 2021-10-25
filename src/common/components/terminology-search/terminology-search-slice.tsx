import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import type { AppState, AppThunk } from '../../../store';
import { TerminologyDTO } from '../../interfaces/terminology.interface';

export interface SearchState {
  value: string;
  results: [TerminologyDTO];
};

const initialState: SearchState = {
  value: '',
  results: [{
    id: '',
    code: null,
    uri: null,
    status: null,
    label: {key: ''},
    description: {},
    informationDomainDTO: null,
    contributors: null,
  }],
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
    setResults(state, action) {
      return {
        ...state,
        ...action.payload
      };
    }
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

export const terminologySearchApi = createApi({
  reducerPath: 'terminologySearchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['TerminologySearch'],
  endpoints: builder => ({
    fetchSearchResult: builder.mutation<TerminologyDTO, string>({
      query(value) {
        return {
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
        };
      },
      invalidatesTags: ['TerminologySearch'],
    }),
  }),
});

export const { useFetchSearchResultMutation } = terminologySearchApi;

export const setFilter = (filter: string): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter({
      value: filter
    }),
  );
};

export const selectFilter = () => (state: AppState): string => state.terminologySearch.value;

export const setResults = (results: any): AppThunk => async dispatch => {
  dispatch(
    terminologySearchSlice.actions.setResults({
      results: results
    })
  );
};

