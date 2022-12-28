import { Model } from '@app/common/interfaces/model.interface';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

export const modelApi = createApi({
  reducerPath: 'model',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['model'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getModel: builder.query<Model, string>({
      query: (prefix) => ({
        url: `/model?prefix=${prefix}`,
        method: 'GET',
      }),
    }),
  }),
});

export default modelApi.reducer;

export const {
  useGetModelQuery,
  util: { getRunningQueriesThunk },
} = modelApi;

export const { getModel } = modelApi.endpoints;
