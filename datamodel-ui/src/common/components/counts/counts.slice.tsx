import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { CountsType } from '@app/common/interfaces/counts.interface';

export const countApi = createApi({
  reducerPath: 'count',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['count'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getCount: builder.query<
      {
        totalHitCount: number;
        counts: CountsType;
      },
      void
    >({
      query: () => ({
        url: '/frontend/counts',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCountQuery,
  util: { getRunningQueriesThunk },
} = countApi;

export const { getCount } = countApi.endpoints;
