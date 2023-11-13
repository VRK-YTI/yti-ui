import { createApi } from '@reduxjs/toolkit/query/react';
import { Counts } from '@app/common/interfaces/counts.interface';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import { StatusCounts } from '@app/common/interfaces/status-counts.interface';

export const countsApi = createApi({
  reducerPath: 'countsApi',
  baseQuery: getTerminologyApiBaseQuery(),
  tagTypes: ['Counts'],
  endpoints: (builder) => ({
    getCounts: builder.query<Counts, null>({
      query: () => ({
        url: '/counts?vocabularies=true',
        method: 'GET',
      }),
    }),
    getVocabularyCount: builder.query<Counts, string>({
      query: (value) => ({
        url: `/conceptCounts?graphId=${value}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }),
    }),
    getStatusCounts: builder.query<StatusCounts, string>({
      query: (value) => ({
        url: `/statusCounts?graphId=${value}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCountsQuery,
  useGetVocabularyCountQuery,
  useGetStatusCountsQuery,
  util: { getRunningQueriesThunk },
} = countsApi;

export const { getCounts, getVocabularyCount, getStatusCounts } =
  countsApi.endpoints;
