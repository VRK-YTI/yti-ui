import { createApi } from '@reduxjs/toolkit/query/react';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import {
  ConceptInfo,
  ConceptResponseObject,
  ConceptSearchRequest,
  SearchResponse,
} from '@app/common/interfaces/interfaces-v2';

export const conceptApi = createApi({
  reducerPath: 'conceptAPI',
  baseQuery: getTerminologyApiBaseQuery(),
  tagTypes: ['Concept'],
  endpoints: (builder) => ({
    getConcept: builder.query<
      ConceptInfo,
      { terminologyId: string; conceptId: string }
    >({
      query: ({ terminologyId, conceptId }) => ({
        url: `/concept/${terminologyId}/${conceptId}`,
        method: 'GET',
      }),
    }),
    deleteConcept: builder.mutation<
      null,
      { prefix: string; conceptId: string }
    >({
      query: (value) => ({
        url: `/concept/${value.prefix}/${value.conceptId}`,
        method: 'DELETE',
      }),
    }),
    searchConcept: builder.mutation<
      SearchResponse<ConceptResponseObject>,
      ConceptSearchRequest
    >({
      query: (request) => ({
        url: '/frontend/search-concepts',
        method: 'GET',
        params: request,
      }),
    }),
  }),
});

export const {
  useGetConceptQuery,
  useSearchConceptMutation,
  useDeleteConceptMutation,
  util: { getRunningQueriesThunk },
} = conceptApi;

export const { getConcept } = conceptApi.endpoints;
