import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axios-base-query';

export const accessRequestApi = createApi({
  reducerPath: 'accessRequestApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.TERMINOLOGY_API_URL
      ? `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend`
      : '/terminology-api/api/v1/frontend',
  }),
  tagTypes: ['AccessRequest'],
  endpoints: (builder) => ({
    getRequests: builder.query<any, null>({
      query: () => ({
        url: '/requests',
        method: 'GET',
      }),
    })
  }),
});

export const { useGetRequestsQuery } = accessRequestApi;

export default accessRequestApi.reducer;
