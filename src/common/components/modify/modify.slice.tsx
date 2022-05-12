import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@app/common/components/axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';

export const modifyApi = createApi({
  reducerPath: 'modifyAPI',
  baseQuery: axiosBaseQuery({
    baseUrl: '/terminology-api/api/v1/frontend',
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Modify'],
  endpoints: (builder) => ({
    postConcept: builder.mutation<any, any>({
      query: (data) => ({
        url: '/modify',
        method: 'POST',
        data: data
      }),
    }),
  }),
});

export const { usePostConceptMutation } = modifyApi;

export const { postConcept } = modifyApi.endpoints;
