import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';

export const datatypesApi = createApi({
  reducerPath: 'datatypesApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/json',
  })),
  tagTypes: ['datatypes'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getDatatypes: builder.query<string[], void>({
      query: () => ({
        url: '/frontend/dataTypes',
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
