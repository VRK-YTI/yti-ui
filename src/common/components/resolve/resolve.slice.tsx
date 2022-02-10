import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axios-base-query';

export const resolveApi = createApi({
  reducerPath: 'resolveAPI',
  baseQuery: axiosBaseQuery({ baseUrl: '/terminology-api/api/v1/resolve' }),
  tagTypes: ['Resolve'],
  endpoints: builder => ({
    getResolve: builder.query<any, string | null>({
      query: (value) => ({
        url: `?uri=${value}`,
        method: 'GET'
      })
    })
  }),
});

export const { useGetResolveQuery } = resolveApi;
