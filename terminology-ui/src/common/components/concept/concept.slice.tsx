import { createApi } from '@reduxjs/toolkit/query/react';
import { Concept } from '@app/common/interfaces/concept.interface';
import { Concepts } from '@app/common/interfaces/concepts.interface';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';

export const conceptApi = createApi({
  reducerPath: 'conceptAPI',
  baseQuery: getTerminologyApiBaseQuery(),
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
    searchConcept: builder.mutation<
      {
        concepts: Concepts[];
        resultStart: number;
        totalHitCount: number;
      },
      {
        terminologyId?: string;
        query?: string;
        notInTerminologyId?: string;
        status?: string;
        pageFrom?: number;
        pageSize?: number;
      }
    >({
      query: (props) => ({
        url: '/searchConcept',
        method: 'POST',
        data: {
          highlight: true,
          ...(props.notInTerminologyId && {
            notInTerminologyId: [props.notInTerminologyId],
          }),
          pageFrom: props.pageFrom ?? 0,
          pageSize: props.pageSize ?? 100,
          ...(props.query && { query: props.query }),
          sortDirection: 'ASC',
          sortLanguage: 'fi',
          ...(props.status && {
            status: [props.status],
          }),
          ...(props.terminologyId && {
            terminologyId: [props.terminologyId],
          }),
        },
      }),
    }),
  }),
});

export const {
  useGetConceptQuery,
  useSearchConceptMutation,
  util: { getRunningQueriesThunk },
} = conceptApi;

export const { getConcept } = conceptApi.endpoints;
