import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import { AccessRequest } from './access-request.interface';

export const accessRequestApi = createApi({
  reducerPath: 'accessRequestApi',
  baseQuery: getTerminologyApiBaseQuery(),
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
