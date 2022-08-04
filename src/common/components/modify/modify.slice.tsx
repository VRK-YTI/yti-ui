import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import generateConcept from '@app/modules/edit-concept/generate-concept';
import { EditCollectionFormDataType } from '@app/modules/edit-collection/edit-collection.types';

export const modifyApi = createApi({
  reducerPath: 'modifyAPI',
  baseQuery: getTerminologyApiBaseQuery(),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Modify'],
  endpoints: (builder) => ({
    addConcept: builder.mutation<
      ReturnType<typeof generateConcept>,
      null | undefined | {}
    >({
      query: (data) => ({
        url: '/modify',
        method: 'POST',
        data: {
          delete: [],
          save: data,
        },
      }),
    }),
    addCollection: builder.mutation<
      EditCollectionFormDataType,
      null | undefined | {}
    >({
      query: (data) => ({
        url: '/modify',
        method: 'POST',
        data: {
          delete: [],
          save: data,
        },
      }),
    }),
  }),
});

export const {
  useAddCollectionMutation,
  useAddConceptMutation,
  util: { getRunningOperationPromises },
} = modifyApi;

export const { addCollection, addConcept } = modifyApi.endpoints;
