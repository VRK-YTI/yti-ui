import { createApi } from '@reduxjs/toolkit/query/react';
import { Collection } from '@app/common/interfaces/collection.interface';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';

//Making the HTTP requests, may be can used to get the registered schemas and crosswalks
export const collectionApi = createApi({
  reducerPath: 'collectionAPI',
  baseQuery: getTerminologyApiBaseQuery(),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Collection'],
  endpoints: (builder) => ({
    getCollection: builder.query<
      Collection,
      { schemaId: string; collectionId: string }
    >({
      query: ({ schemaId, collectionId }) => ({
        url: `/collection?graphId=${schemaId}&collectionId=${collectionId}`,
        method: 'GET',
      }),
    }),
    getCollections: builder.query<Collection[], string>({
      query: (schemaId) => ({
        url: `/collections?graphId=${schemaId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCollectionQuery,
  useGetCollectionsQuery,
  util: { getRunningQueriesThunk },
} = collectionApi;

export const { getCollection, getCollections } = collectionApi.endpoints;
