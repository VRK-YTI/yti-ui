import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import generateConcept from '@app/modules/edit-concept/generate-concept';
import { EditCollectionFormDataType } from '@app/modules/edit-collection/edit-collection.types';
import { NewTerminology } from '@app/common/interfaces/new-terminology';

export const modifyApi = createApi({
  reducerPath: 'modifyAPI',
  baseQuery: getTerminologyApiBaseQuery(),
  tagTypes: ['Modify'],
  endpoints: (builder) => ({
    addConcept: builder.mutation<
      ReturnType<typeof generateConcept>,
      null | undefined | {}
    >({
      query: (data) => ({
        url: '/modify',
        method: 'POST',
        data: data,
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
    editTerminology: builder.mutation<NewTerminology, null | undefined | {}>({
      query: (data) => ({
        url: '/modify',
        method: 'POST',
        data: {
          delete: [],
          save: [data],
        },
      }),
    }),
  }),
});

export const {
  useAddCollectionMutation,
  useAddConceptMutation,
  useEditTerminologyMutation,
  util: { getRunningOperationPromises },
} = modifyApi;

export const { addCollection, addConcept, editTerminology } =
  modifyApi.endpoints;
