import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';

export const prefixApi = createApi({
  reducerPath: 'prefixApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Prefix'],
  endpoints: (builder) => ({
    getModelExists: builder.mutation<boolean, string>({
      query: (prefix) => ({
        url: `/model/${prefix}/exists`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetModelExistsMutation,
  util: { getRunningQueriesThunk },
} = prefixApi;

export const { getModelExists } = prefixApi.endpoints;
