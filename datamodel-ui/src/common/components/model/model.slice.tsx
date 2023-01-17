import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Model } from '@app/common/interfaces/model.interface';

export const modelApi = createApi({
  reducerPath: 'modelApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['model'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getModel: builder.query<Model, string>({
      query: (modelId) => ({
        url: `/model?prefix=${modelId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { getModel } = modelApi.endpoints;

export const {
  useGetModelQuery,
  util: { getRunningQueriesThunk },
} = modelApi;
