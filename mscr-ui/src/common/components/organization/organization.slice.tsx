import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { HYDRATE } from 'next-redux-wrapper';
import { MscrSearchResults } from '@app/common/interfaces/search.interface';

export const mscrSearchOrgContentApi = createApi({
  reducerPath: 'mscrSearchOrgContentApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['mscrSearchOrgContentApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getOrgContent: builder.query<MscrSearchResults, { type: string; ownerOrg: string }>({
      query: ({ type, ownerOrg }) => ({
        url: `/frontend/mscrSearchOrgContent?query=&type=${type}&ownerOrg=${ownerOrg}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetOrgContentQuery,
  util: { getRunningQueriesThunk },
} = mscrSearchOrgContentApi;
