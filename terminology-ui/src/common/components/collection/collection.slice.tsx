import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import { ConceptCollectionInfo } from '@app/common/interfaces/interfaces-v2';

export const collectionApi = createApi({
  reducerPath: 'collectionAPI',
  baseQuery: getTerminologyApiBaseQuery(),
  tagTypes: ['Collection'],
  endpoints: (builder) => ({
    getCollection: builder.query<
      ConceptCollectionInfo,
      { terminologyId: string; collectionId: string }
    >({
      query: ({ terminologyId, collectionId }) => ({
        url: `/collection/${terminologyId}/${collectionId}`,
        method: 'GET',
      }),
    }),
    getCollections: builder.query<ConceptCollectionInfo[], string>({
      query: (terminologyId) => ({
        url: `/collection/${terminologyId}`,
        method: 'GET',
      }),
    }),
    deleteCollection: builder.mutation<
      null,
      { prefix: string; collectionId: string }
    >({
      query: (value) => ({
        url: `/collection/${value.prefix}/${value.collectionId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetCollectionQuery,
  useGetCollectionsQuery,
  useDeleteCollectionMutation,
  util: { getRunningQueriesThunk },
} = collectionApi;

export const { getCollection, getCollections } = collectionApi.endpoints;
