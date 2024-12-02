import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import {
  Concept,
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
    createConcept: builder.mutation<null, { prefix: string; concept: Concept }>(
      {
        query: (value) => ({
          url: `/concept/${value.prefix}`,
          method: 'POST',
          data: value.concept,
        }),
      }
    ),
    updateConcept: builder.mutation<
      null,
      { prefix: string; conceptId: string; concept: Concept }
    >({
      query: (value) => ({
        url: `/concept/${value.prefix}/${value.conceptId}`,
        method: 'PUT',
        data: value.concept,
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
    conceptExists: builder.mutation<
      boolean,
      { terminologyId: string; conceptId: string }
    >({
      query: (params) => ({
        url: `/concept/${params.terminologyId}/${params.conceptId}/exists`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetConceptQuery,
  useCreateConceptMutation,
  useUpdateConceptMutation,
  useConceptExistsMutation,
  useSearchConceptMutation,
  useDeleteConceptMutation,
  util: { getRunningQueriesThunk },
} = conceptApi;

export const { getConcept } = conceptApi.endpoints;
