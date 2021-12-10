import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AppState, AppThunk } from '../../../store';
import { GroupSearchResult, OrganizationSearchResult, TerminologySearchResult } from '../../interfaces/terminology.interface';

export interface SearchState {
  filter: {
    infoDomains: { [status: string]: boolean };
    keyword: string;
    showByOrg: string;
    status: { [status: string]: boolean };
  };
  resultStart: number;
  searchTerm: string;
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
  },
  resultStart: 0,
  searchTerm: ''
};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setResultStart(state, action) {
      state.resultStart = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    }
  }
});

export const terminologySearchApi = createApi({
  reducerPath: 'terminologySearchApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['TerminologySearch'],
  endpoints: builder => ({
    getSearchResult: builder.query<TerminologySearchResult, {searchTerm: string, resultStart: number}>({
      query: (value) => ({
        url: '/searchTerminology',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: {
          query: value.searchTerm,
          searchConcepts: true,
          prefLang: 'fi',
          pageSize: 10,
          pageFrom: value.resultStart,
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
    terminologySearchSlice.actions.setFilter(filter)
  );
};

export const resetFilter = (): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setFilter(
      initialState.filter
    )
  );
};

export const setSearchTerm = (searchTerm: string): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setSearchTerm(searchTerm)
  );
};

export const setResultStart = (resultStart: number): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setResultStart(resultStart),
  );
};

export const selectFilter = () => (state: AppState): any => state.terminologySearch.filter;
export const selectResultStart = () => (state: AppState): any => state.terminologySearch.resultStart;
export const selectSearchTerm = () => (state: AppState): any => state.terminologySearch.searchTerm;

export default terminologySearchSlice.reducer;
