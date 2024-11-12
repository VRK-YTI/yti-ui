import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyBaseQuery } from '@app/store/api-base-query';
import { Concept } from '@app/common/interfaces/concept';

export const conceptSearchApi = createApi({
  reducerPath: 'conceptSearchApi',
  baseQuery: getTerminologyBaseQuery(),
  endpoints: (builder) => ({
    getConcepts: builder.query<
      {
        totalHitCount: number;
        pageSize: number;
        pageFrom: number;
        responseObjects: Concept[];
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
        url: '/frontend/search-concepts',
        method: 'GET',
        params: {
          highlight: data.highlight ?? true,
          pageFrom: data.pageFrom ? (data.pageFrom - 1) * 20 : 0,
          pageSize: 20,
          query: data.keyword,
          sortDirection: 'ASC',
          sortLanguage: data.lang ?? 'fi',
          status: [],
          namespaces: data.terminologies ?? [],
          extendTerminologies: true,
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
