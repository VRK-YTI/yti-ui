import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQueryV2 } from '@app/store/api-base-query';
import { NewModel } from '@app/common/interfaces/new-model';

export const modelApi = createApi({
  reducerPath: 'model',
  baseQuery: getDatamodelApiBaseQueryV2(),
  tagTypes: ['model'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    putModel: builder.mutation<string, NewModel>({
      query: (value) => ({
        url: '/model',
        method: 'PUT',
        data: value,
      }),
    }),
  }),
});

export const {
  usePutModelMutation,
  util: { getRunningQueriesThunk },
} = modelApi;

export const { putModel } = modelApi.endpoints;
