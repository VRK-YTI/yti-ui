import { createApi } from '@reduxjs/toolkit/query/react';
import { Concept } from '@app/common/interfaces/concept.interface';
import axiosBaseQuery from '@app/common/components/axios-base-query';
import { HYDRATE } from 'next-redux-wrapper';

export const conceptApi = createApi({
  reducerPath: 'conceptAPI',
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.TERMINOLOGY_API_URL ?
      `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend`
      : '/terminology-api/api/v1/frontend',
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
    searchConcept: builder.mutation<any, { terminologyId?: string; query?: string; notInTerminologyId?: string; status?: string }>({
      query: (props) => ({
        url: '/searchConcept',
        method: 'POST',
        data: {
          highlight: true,
          ...(props.notInTerminologyId && {
            notInTerminologyId: [
              props.notInTerminologyId
            ]
          }),
          pageFrom: 0,
          pageSize: 100,
          ...(props.query && { query: props.query }),
          sortDirection: 'ASC',
          sortLanguage: 'fi',
          ...(props.status && {
            status: [
              props.status
            ]
          }),
          ...(props.terminologyId && {
            terminologyId: [
              props.terminologyId
            ]
          })
        }
      }),
    })
  }),
});

export const {
  useGetConceptQuery,
  useSearchConceptMutation,
  util: { getRunningOperationPromises },
} = conceptApi;

export const { getConcept } = conceptApi.endpoints;
