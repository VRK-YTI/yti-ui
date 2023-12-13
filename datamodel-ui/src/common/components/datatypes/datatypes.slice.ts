import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { UriData } from '@app/common/interfaces/uri.interface';

export const datatypesApi = createApi({
  reducerPath: 'datatypesApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/json',
  })),
  tagTypes: ['Datatypes'],
  endpoints: (builder) => ({
    getDatatypes: builder.query<UriData[], void>({
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
