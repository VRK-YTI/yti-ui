import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import {
  MscrSearchResults,
  PaginatedQuery,
} from '@app/common/interfaces/search.interface';
import { UrlState } from '@app/common/utils/hooks/use-url-state';

function createUrl(
  scope: string,
  { type, pageSize, urlState, ownerOrg }: PaginatedQuery
) {
  const pageFrom = (urlState.page - 1) * pageSize;
  return `/frontend/mscrSearch${scope}Content?query=&type=${type}${
    scope === 'Org' ? `&ownerOrg=${ownerOrg}` : ''
  }&pageSize=${pageSize}&pageFrom=${pageFrom}`;
}

function createSearchUrl(urlState: UrlState) {
  let baseQuery = '/frontend/mscrSearch?';

  baseQuery = baseQuery.concat(`query=${urlState.q}`);

  if (urlState.type && urlState.type.length > 0) {
    baseQuery = baseQuery.concat(`&type=${urlState.type.join(',')}`);
  }
  if (urlState.state && urlState.state.length > 0) {
    baseQuery = baseQuery.concat(`&state=${urlState.state.join(',')}`);
  }
  if (urlState.format && urlState.format.length > 0) {
    baseQuery = baseQuery.concat(`&format=${urlState.format.join(',')}`);
  }
  if (urlState.isReferenced && urlState.isReferenced.length > 0) {
    baseQuery = baseQuery.concat(
      `&sourceType=${urlState.isReferenced.join(',')}`
    );
  }
  if (urlState.organization && urlState.organization.length > 0) {
    baseQuery = baseQuery.concat(
      `&organization=${urlState.organization.join(',')}`
    );
  }

  return baseQuery.concat('&includeFacets=true&pageSize=50');
}

export const mscrSearchApi = createApi({
  reducerPath: 'mscrSearchApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['MscrSearch', 'OrgContent', 'PersonalContent'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getMscrSearchResults: builder.query<MscrSearchResults, UrlState>({
      query: (urlState) => ({
        url: createSearchUrl(urlState),
        method: 'GET',
      }),
      providesTags: ['MscrSearch'],
    }),
    getOrgContent: builder.query<MscrSearchResults, PaginatedQuery>({
      query: (query) => ({
        url: createUrl('Org', query),
        method: 'GET',
      }),
      providesTags: ['OrgContent'],
    }),
    getPersonalContent: builder.query<MscrSearchResults, PaginatedQuery>({
      query: (query) => ({
        url: createUrl('Personal', query),
        method: 'GET',
      }),
      providesTags: ['PersonalContent'],
    }),
  }),
});

export const { getMscrSearchResults, getOrgContent, getPersonalContent } =
  mscrSearchApi.endpoints;

export const {
  useGetMscrSearchResultsQuery,
  useGetOrgContentQuery,
  useGetPersonalContentQuery,
  util: { getRunningQueriesThunk },
} = mscrSearchApi;
