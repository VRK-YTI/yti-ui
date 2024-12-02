import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import {
  ConceptCollection,
  ConceptCollectionInfo,
} from '@app/common/interfaces/interfaces-v2';

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
    addCollection: builder.mutation<
      null,
      {
        terminologyId: string;
        payload: ConceptCollection;
      }
    >({
      query: (data) => ({
        url: `/collection/${data.terminologyId}`,
        method: 'POST',
        data: data.payload,
      }),
    }),
    updateCollection: builder.mutation<
      null,
      {
        terminologyId: string;
        collectionId: string;
        payload: ConceptCollection;
      }
    >({
      query: (data) => ({
        url: `/collection/${data.terminologyId}/${data.collectionId}`,
        method: 'PUT',
        data: data.payload,
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
    collectionExists: builder.mutation<
      boolean,
      { terminologyId: string; collectionId: string }
    >({
      query: (params) => ({
        url: `/collection/${params.terminologyId}/${params.collectionId}/exists`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCollectionQuery,
  useGetCollectionsQuery,
  useAddCollectionMutation,
  useUpdateCollectionMutation,
  useCollectionExistsMutation,
  useDeleteCollectionMutation,
  util: { getRunningQueriesThunk },
} = collectionApi;

export const { getCollection, getCollections } = collectionApi.endpoints;
