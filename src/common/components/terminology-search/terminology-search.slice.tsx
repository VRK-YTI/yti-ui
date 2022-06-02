import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  GroupSearchResult,
  OrganizationSearchResult,
  TerminologySearchResult,
} from '@app/common/interfaces/terminology.interface';
import { UrlState } from '@app/common/utils/hooks/useUrlState';
import axiosBaseQuery from '@app/common/components/axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {},
});

export const terminologySearchApi = createApi({
  reducerPath: 'terminologySearchApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.TERMINOLOGY_API_URL
      ? `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend`
      : '/terminology-api/api/v1/frontend',
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['TerminologySearch'],
  endpoints: (builder) => ({
    getSearchResult: builder.query<
      TerminologySearchResult,
      { urlState: UrlState; language: string }
    >({
      query: (value) => ({
        url: '/searchTerminology',
        method: 'POST',
        data: {
          query: value.urlState.q,
          statuses: value.urlState.status.map((s) => s.toUpperCase()),
          groups: value.urlState.domain,
          organizations: value.urlState.organization
            ? [value.urlState.organization]
            : [],
          searchConcepts: true,
          prefLang:
            value.urlState.lang
              ? value.urlState.lang
              : value.language
                ? value.language
                : 'fi',
          pageSize: 10,
          pageFrom: Math.max(0, (value.urlState.page - 1) * 10),
        },
      }),
      providesTags: ['TerminologySearch'],
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
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetSearchResultQuery,
  useGetOrganizationsQuery,
  util: { getRunningOperationPromises },
} = terminologySearchApi;

export const { getSearchResult, getGroups, getOrganizations } =
  terminologySearchApi.endpoints;

export default terminologySearchSlice.reducer;
