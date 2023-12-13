import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import { MscrSearchResults } from '@app/common/interfaces/search.interface';
import { UrlState } from '@app/common/utils/hooks/use-url-state';

function createUrl(urlState: UrlState) {
  let baseQuery = '/frontend/mscrSearch?';

  // Not clear what the logic for using /mscrSearchOrgContent or /mscrSearchPersonalContent endpoints will be
  // The idea is that they can access content that is not public

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

  return baseQuery.concat('&includeFacets=true');
}

export const mscrSearchApi = createApi({
  reducerPath: 'mscrSearchApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['mscrSearch'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getMscrSearchResults: builder.query<MscrSearchResults, UrlState>({
      query: (urlState) => ({
        url: createUrl(urlState),
        method: 'GET',
      }),
    }),
  }),
});

export const { getMscrSearchResults } = mscrSearchApi.endpoints;

export const {
  useGetMscrSearchResultsQuery,
  util: { getRunningQueriesThunk },
} = mscrSearchApi;
