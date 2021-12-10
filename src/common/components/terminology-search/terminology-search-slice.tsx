import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import type { AppState, AppThunk } from '../../../store';
import { GroupSearchResult, OrganizationSearchResult, TerminologySearchResult } from '../../interfaces/terminology.interface';

export interface SearchState {
  filter: {
    infoDomains: { [status: string]: boolean };
    keyword: string;
    showByOrg: string;
    status: { [status: string]: boolean };
  };
};

export const initialState: SearchState = {
  filter: {
    infoDomains: {},
    keyword: '',
    showByOrg: '',
    status: {
      'VALID': true,
      'DRAFT': true,
      'RETIRED': false,
      'SUPERSEDED': false
    }
  }
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
          pageSize: 10,
          pageFrom: 0,
        },
      }),
    }),
    getGroups: builder.query<GroupSearchResult[], null>({
      query: () => ({
        url: '/groups',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }),
    }),
    getOrganizations: builder.query<OrganizationSearchResult[], null>({
      query: () => ({
        url: '/organizations',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }),
    })
  }),
});

export const {
  useGetGroupsQuery,
  useGetSearchResultQuery,
  useGetOrganizationsQuery
} = terminologySearchApi;

export const setFilter = (filter: string): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter({
      filter: filter
    }),
  );
};

export const resetFilter = (): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter(
      initialState
    )
  );
};

export const selectFilter = () => (state: AppState): any => state.terminologySearch.filter;
export default terminologySearchSlice.reducer;
