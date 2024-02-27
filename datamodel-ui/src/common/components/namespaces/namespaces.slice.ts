import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';

export const namespacesApi = createApi({
  reducerPath: 'namespacesApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/json',
  })),
  tagTypes: ['Namespaces'],
  endpoints: (builder) => ({
    getNamespaces: builder.query<string[], void>({
      query: () => ({
        url: '/frontend/namespaces',
        method: 'GET',
      }),
    }),
  }),
});

export const { getNamespaces } = namespacesApi.endpoints;

export const {
  useGetNamespacesQuery,
  util: { getRunningQueriesThunk },
} = namespacesApi;
