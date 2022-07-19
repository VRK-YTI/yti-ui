import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';

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
    addConcept: builder.mutation<any, any>({
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
  useAddConceptMutation,
  util: { getRunningOperationPromises },
} = modifyApi;

export const { addConcept } = modifyApi.endpoints;
