import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import { MscrSearchResults, PaginatedQuery } from '@app/common/interfaces/search.interface';

function createUrl({ type, ownerOrg, pageSize, pageFrom }: PaginatedQuery) {
  return `/frontend/mscrSearchOrgContent?query=&type=${type}&ownerOrg=${ownerOrg}&pageSize=${pageSize}&pageFrom=${pageFrom}`;
}

export const mscrSearchOrgContentApi = createApi({
  reducerPath: 'mscrSearchOrgContentApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['mscrSearchOrgContentApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getOrgContent: builder.query<MscrSearchResults, PaginatedQuery>({
      query: (query) => ({
        url: createUrl(query),
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetOrgContentQuery,
  util: { getRunningQueriesThunk },
} = mscrSearchOrgContentApi;
