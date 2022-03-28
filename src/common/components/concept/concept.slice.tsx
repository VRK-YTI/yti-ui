import { createApi } from '@reduxjs/toolkit/query/react';
import { Concept } from '@app/common/interfaces/concept.interface';
import axiosBaseQuery from '@app/common/components/axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';

export const conceptApi = createApi({
  reducerPath: 'conceptAPI',
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend`,
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Concept'],
  endpoints: (builder) => ({
    getConcept: builder.query<
      Concept,
      { terminologyId: string; conceptId: string }
    >({
      query: ({ terminologyId, conceptId }) => ({
        url: `/concept?graphId=${terminologyId}&conceptId=${conceptId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetConceptQuery,
  util: { getRunningOperationPromises },
} = conceptApi;

export const { getConcept } = conceptApi.endpoints;
