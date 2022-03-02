import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  GroupSearchResult,
  OrganizationSearchResult,
  TerminologySearchResult
} from '../../interfaces/terminology.interface';
import { UrlState } from '../../utils/hooks/useUrlState';
import axiosBaseQuery from '../axios-base-query';

export interface SearchState { };

export const initialState: SearchState = {};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {},
});

export const terminologySearchApi = createApi({
  reducerPath: 'terminologySearchApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.TERMINOLOGY_API_URL
      ?
      `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend`
      :
      '/terminology-api/api/v1/frontend'
  }),
  tagTypes: ['TerminologySearch'],
  endpoints: builder => ({
    getSearchResult: builder.query<TerminologySearchResult, { urlState: UrlState }>({
      query: (value) => ({
        url: '/searchTerminology',
        method: 'POST',
        data: {
          query: value.urlState.q,
          statuses: value.urlState.status.map(s => s.toUpperCase()),
          groups: value.urlState.domain,
          organizations: value.urlState.organization ? [value.urlState.organization] : [],
          searchConcepts: true,
          prefLang: 'fi',
          pageSize: 10,
          pageFrom: Math.max(0, (value.urlState.page - 1) * 10),
        },
      }),
    }),
    getGroups: builder.query<GroupSearchResult[], string>({
      query: (value) => ({
        url: `/v2/groups?language=${value}`,
        method: 'GET',
      }),
    }),
    getOrganizations: builder.query<OrganizationSearchResult[], string>({
      query: (value) => ({
        url: `/v2/organizations?language=${value}`,
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

export default terminologySearchSlice.reducer;
