import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';

export const namespacesApi = createApi({
  reducerPath: 'namespacesApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/json',
  })),
  tagTypes: ['Namespaces', 'Model'],
  endpoints: (builder) => ({
    getNamespaces: builder.query<string[], void>({
      query: () => ({
        url: '/frontend/namespaces',
        method: 'GET',
      }),
    }),
    changeNamespaceVersion: builder.mutation<
      void,
      { prefix: string; newVersion: string; referenceURI: string }
    >({
      query: ({ prefix, newVersion, referenceURI }) => ({
        url: `/model/${prefix}/change-reference-version`,
        method: 'PUT',
        params: {
          ...(newVersion && { newVersion }),
          referenceURI,
        },
      }),
      invalidatesTags: ['Model'],
    }),
  }),
});

export const { getNamespaces } = namespacesApi.endpoints;

export const {
  useGetNamespacesQuery,
  useChangeNamespaceVersionMutation,
  util: { getRunningQueriesThunk },
} = namespacesApi;
