import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';

export const modifyStatusesApi = createApi({
  reducerPath: 'modifyStatusesApi',
  baseQuery: getTerminologyApiBaseQuery(),
  endpoints: (builder) => ({
    modifyStatuses: builder.mutation<
      null,
      { graphId: string; oldStatus: string; newStatus: string; types: string[] }
    >({
      query: (p) => ({
        url: `/modifyStatuses?graphId=${p.graphId}&oldStatus=${
          p.oldStatus
        }&newStatus=${p.newStatus}&types=${p.types.join(',')}`,
        method: 'POST',
        data: {},
      }),
    }),
  }),
});

export const {
  useModifyStatusesMutation,
  util: { getRunningQueriesThunk },
} = modifyStatusesApi;

export const { modifyStatuses } = modifyStatusesApi.endpoints;
