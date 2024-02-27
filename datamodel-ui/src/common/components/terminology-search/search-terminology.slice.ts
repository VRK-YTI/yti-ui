import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyBaseQuery } from '@app/store/api-base-query';
import { Status } from '@app/common/interfaces/status.interface';
import { SearchTerminology } from '@app/common/interfaces/search-terminology.interface';

export interface TerminologySearchParams {
  query: string;
  status?: Status[];
  groups?: string[];
  sortLang?: string;
  pageSize?: number;
  pageFrom?: number;
}

export const searchTerminologyApi = createApi({
  reducerPath: 'searchTerminologyApi',
  baseQuery: getTerminologyBaseQuery(),
  tagTypes: ['SearchTerminology'],
  endpoints: (builder) => ({
    getTerminologies: builder.mutation<
      SearchTerminology,
      TerminologySearchParams
    >({
      query: (data) => ({
        url: '/v1/frontend/searchTerminology',
        method: 'POST',
        data: {
          query: data.query,
          groupNotations: data.groups,
          pageFrom: data.pageFrom,
          pageSize: 10,
          hideHighlights: true,
        },
      }),
    }),
  }),
});

export const { getTerminologies } = searchTerminologyApi.endpoints;

export const {
  useGetTerminologiesMutation,
  util: { getRunningQueriesThunk },
} = searchTerminologyApi;
