import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';

export const datatypesApi = createApi({
  reducerPath: 'datatypesApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/json',
  })),
  tagTypes: ['datatypes'],
  endpoints: (builder) => ({
    getDatatypes: builder.query<string[], void>({
      query: () => ({
        url: '/frontend/data-types',
        method: 'GET',
      }),
    }),
  }),
});

export const { getDatatypes } = datatypesApi.endpoints;

export const {
  useGetDatatypesQuery,
  util: { getRunningQueriesThunk },
} = datatypesApi;
