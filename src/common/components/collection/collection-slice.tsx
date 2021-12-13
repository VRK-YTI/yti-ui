import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Collection } from '../../interfaces/collection.interface';

export const collectionApi = createApi({
  reducerPath: 'collectionAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/terminology-api/api/v1/frontend' }),
  tagTypes: ['Collection'],
  endpoints: builder => ({
    getCollection: builder.query<Collection, { terminologyId: string, collectionId: string }>({
      query: ({ terminologyId, collectionId }) => ({
        url: `/collection?graphId=${terminologyId}&collectionId=${collectionId}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      })
    })
  }),
});

export const { useGetCollectionQuery } = collectionApi;
