import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import {
  MscrSearchResults,
  PaginatedQuery,
} from '@app/common/interfaces/search.interface';

function createUrl({ type, pageSize, pageFrom }: PaginatedQuery) {
  return `/frontend/mscrSearchPersonalContent?query=&type=${type}&pageSize=${pageSize}&pageFrom=${pageFrom}`;
}

export const mscrSearchPersonalContentApi = createApi({
  reducerPath: 'mscrSearchPersonalContentApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['mscrSearchPersonalContentApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getPersonalContent: builder.query<MscrSearchResults, PaginatedQuery>({
      query: (query) => ({
        url: createUrl(query),
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetPersonalContentQuery,
  util: { getRunningQueriesThunk },
} = mscrSearchPersonalContentApi;
