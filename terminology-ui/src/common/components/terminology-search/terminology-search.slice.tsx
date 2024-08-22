import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { UrlState } from '@app/common/utils/hooks/use-url-state';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import { Organization } from 'yti-common-ui/interfaces/organization.interface';
import { Group } from 'yti-common-ui/interfaces/group.interface';
import {
  SearchResponse,
  TerminogyResponseObject,
} from '@app/common/interfaces/interfaces-v2';

export const initialState = {};

export const terminologySearchSlice = createSlice({
  name: 'terminologySearch',
  initialState,
  reducers: {},
});

export const terminologySearchApi = createApi({
  reducerPath: 'terminologySearchApi',
  baseQuery: getTerminologyApiBaseQuery(),
  tagTypes: ['TerminologySearch'],
  endpoints: (builder) => ({
    getSearchResult: builder.query<
      SearchResponse<TerminogyResponseObject>,
      { urlState: UrlState; language: string }
    >({
      query: (value) => ({
        url: '/frontend/search-terminologies',
        method: 'GET',
        params: {
          query: value.urlState.q,
          status: value.urlState.status.map((s) => s.toUpperCase()),
          groups: value.urlState.domain,
          organizations: value.urlState.organization
            ? [value.urlState.organization]
            : [],
          searchConcepts: true,
          prefLang: value.language ? value.language : 'fi',
          pageSize: 50,
          pageFrom: Math.max(0, (value.urlState.page - 1) * 50),
          language: value.urlState.lang ? value.urlState.lang : null,
        },
      }),
      providesTags: ['TerminologySearch'],
    }),
    getGroups: builder.query<Group[], string>({
      query: (value) => ({
        url: `/frontend/service-categories?language=${value}`,
        method: 'GET',
      }),
    }),
    getOrganizations: builder.query<
      Organization[],
      { language: string; showChildOrganizations?: boolean }
    >({
      query: (value) => ({
        url: `/frontend/organizations?language=${
          value.language
        }&showChildOrganizations=${value.showChildOrganizations ?? false}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetSearchResultQuery,
  useGetOrganizationsQuery,
  util: { getRunningQueriesThunk },
} = terminologySearchApi;

export const { getSearchResult, getGroups, getOrganizations } =
  terminologySearchApi.endpoints;

export default terminologySearchSlice.reducer;
