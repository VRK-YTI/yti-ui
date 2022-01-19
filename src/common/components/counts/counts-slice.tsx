import { createApi } from '@reduxjs/toolkit/query/react';
import { Counts } from '../../interfaces/counts.interface';
import axiosBaseQuery from '../axios-base-query';

export const countsApi = createApi({
  reducerPath: 'countsApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['Counts'],
  endpoints: builder => ({
    getCounts: builder.query<Counts, null>({
      query: () => ({
        url: '/counts',
        method: 'GET'
      })
    })
  }),
});

export const { useGetCountsQuery } = countsApi;
