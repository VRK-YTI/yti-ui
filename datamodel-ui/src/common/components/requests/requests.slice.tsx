import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Request } from 'yti-common-ui/interfaces/request.interface';

export const requestApi = createApi({
  reducerPath: 'requestApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Request'],
  endpoints: (builder) => ({
    getRequests: builder.query<Request[], void>({
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

export const {
  useGetRequestsQuery,
  usePostRequestMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = requestApi;

export const { getRequests } = requestApi.endpoints;

export default requestApi.reducer;
