import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../axios-base-query';
import { AccessRequest } from './access-request.interface';

export const accessRequestApi = createApi({
  reducerPath: 'accessRequestApi',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.TERMINOLOGY_API_URL
      ? `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend`
      : '/terminology-api/api/v1/frontend',
  }),
  tagTypes: ['AccessRequest'],
  endpoints: (builder) => ({
    getRequests: builder.query<AccessRequest[], null>({
      query: () => ({
        url: '/requests',
        method: 'GET',
      }),
    }),
    postRequest: builder.mutation<null, string>({
      query: (uri) => ({
        url: uri,
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetRequestsQuery, usePostRequestMutation } = accessRequestApi;

export default accessRequestApi.reducer;
