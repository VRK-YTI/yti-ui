import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';

export const removeApi = createApi({
  reducerPath: 'removeApi',
  baseQuery: getTerminologyApiBaseQuery(),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Remove'],
  endpoints: (builder) => ({
    deleteConcept: builder.mutation<any, any>({
      query: (data) => ({
        url: '/remove?sync=true&disconnect=true',
        method: 'DELETE',
        data: data
      })
    }),
  }),
});

export const {
  useDeleteConceptMutation,
} = removeApi;
