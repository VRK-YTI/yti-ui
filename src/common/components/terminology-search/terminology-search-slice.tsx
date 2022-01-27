import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { AppState, AppThunk } from '../../../store';
import { GroupSearchResult, OrganizationSearchResult, TerminologySearchResult } from '../../interfaces/terminology.interface';
import axiosBaseQuery from '../axios-base-query';

export interface SearchState {
  filter: {
    infoDomains: {id: string, value: string}[] | [];
    showByOrg: {
      id: string;
      value: string;
    };
    status: { [status: string]: boolean };
  };
  resultStart: number;
  searchTerm: string;
};

export const initialState: SearchState = {
  filter: {
    infoDomains: [],
    showByOrg: {
      id: '',
      value: ''
    },
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
  baseQuery: axiosBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['TerminologySearch'],
  endpoints: builder => ({
    getSearchResult: builder.query<TerminologySearchResult, { filter: SearchState['filter'], resultStart: number, keyword: string }>({
      query: (value) => ({
        url: '/searchTerminology',
        method: 'POST',
        data: {
          query: value.keyword,
          statuses: Array.from(Object.keys(value.filter.status).filter(s => value.filter.status[s])),
          groups: value.filter.infoDomains.map(infoD => infoD.id),
          organizations: value.filter.showByOrg.id ? [value.filter.showByOrg.id] : [],
          searchConcepts: true,
          prefLang: 'fi',
          pageSize: 10,
          pageFrom: value.resultStart,
        },
      }),
    }),
    getGroups: builder.query<GroupSearchResult[], string>({
      query: (value) => ({
        url: `/groups?language=${value}`,
        method: 'GET',
      }),
    }),
    getOrganizations: builder.query<OrganizationSearchResult[], string>({
      query: (value) => ({
        url: `/organizations?language=${value}`,
        method: 'GET',
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

export const setResultStart = (resultStart: number): AppThunk => dispatch => {
  dispatch(
    terminologySearchSlice.actions.setResultStart(resultStart),
  );
};

export const selectFilter = () => (state: AppState): any => state.terminologySearch.filter;
export const selectResultStart = () => (state: AppState): any => state.terminologySearch.resultStart;

export default terminologySearchSlice.reducer;
