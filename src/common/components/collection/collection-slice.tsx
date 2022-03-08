import { createApi } from '@reduxjs/toolkit/query/react';
import { Collection } from '../../interfaces/collection.interface';
import axiosBaseQuery from '../axios-base-query';

export const collectionApi = createApi({
  reducerPath: 'collectionAPI',
  baseQuery: axiosBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['Collection'],
  endpoints: (builder) => ({
    getCollection: builder.query<
      Collection,
      { terminologyId: string; collectionId: string }
    >({
      query: ({ terminologyId, collectionId }) => ({
        url: `/collection?graphId=${terminologyId}&collectionId=${collectionId}`,
        method: 'GET',
      }),
    }),
    getCollections: builder.query<Collection[], string>({
      query: (terminologyId) => ({
        url: `/collections?graphId=${terminologyId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCollectionQuery, useGetCollectionsQuery } = collectionApi;
