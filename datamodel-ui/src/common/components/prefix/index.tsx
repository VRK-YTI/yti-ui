import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';

export const prefixApi = createApi({
  reducerPath: 'prefixApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['prefix'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getFreePrefix: builder.mutation<boolean, string>({
      query: (prefix) => ({
        url: `/freePrefix?prefix=${prefix}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetFreePrefixMutation,
  util: { getRunningQueriesThunk },
} = prefixApi;

export const { getFreePrefix } = prefixApi.endpoints;
