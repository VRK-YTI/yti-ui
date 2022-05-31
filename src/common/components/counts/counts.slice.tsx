import { createApi } from '@reduxjs/toolkit/query/react';
import { Counts } from '@app/common/interfaces/counts.interface';
import axiosBaseQuery from '@app/common/components/axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';

export const countsApi = createApi({
  reducerPath: 'countsApi',
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
  }),
});

export const {
  useGetCountsQuery,
  useGetVocabularyCountQuery,
  util: { getRunningOperationPromises },
} = countsApi;

export const { getCounts, getVocabularyCount } = countsApi.endpoints;
