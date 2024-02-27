import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyBaseQuery } from '@app/store/api-base-query';
import { Concept } from '@app/common/interfaces/concept';

export const conceptSearchApi = createApi({
  reducerPath: 'conceptSearchApi',
  baseQuery: getTerminologyBaseQuery(),
  endpoints: (builder) => ({
    getConcepts: builder.query<
      {
        concepts: Concept[];
        resultStart: number;
        totalHitCount: number;
      },
      {
        keyword: string;
        terminologies: string[];
        pageFrom: number;
        lang?: string;
        internal?: boolean;
        highlight?: boolean;
      }
    >({
      query: (data) => ({
        url: '/v1/frontend/searchConcept',
        method: 'POST',
        data: {
          highlight: data.highlight ?? true,
          pageFrom: data.pageFrom ? (data.pageFrom - 1) * 20 : 0,
          pageSize: 20,
          query: data.keyword,
          sortDirection: 'ASC',
          sortLanguage: data.lang ?? 'fi',
          status: [],
          terminologyId: [],
          terminologyUri: data.terminologies ?? [],
          options: {
            operationMode: 'NO_INCOMPLETE',
          },
        },
      }),
    }),
  }),
});

export const { getConcepts } = conceptSearchApi.endpoints;

export const {
  useGetConceptsQuery,
  util: { getRunningQueriesThunk },
} = conceptSearchApi;
