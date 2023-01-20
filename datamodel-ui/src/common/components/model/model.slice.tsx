import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  getDatamodelApiBaseQuery,
  getDatamodelApiBaseQueryV2,
} from '@app/store/api-base-query';
import { NewModel } from '@app/common/interfaces/new-model.interface';
import { Model } from '@app/common/interfaces/model.interface';

export const modelApiV2 = createApi({
  reducerPath: 'model',
  baseQuery: getDatamodelApiBaseQueryV2(),
  tagTypes: ['modelV2'],
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

export const {
  usePutModelMutation,
  util: { getRunningQueriesThunk: getRunningQueriesThunkV2 },
} = modelApiV2;

export const {
  useGetModelQuery,
  util: { getRunningQueriesThunk },
} = modelApi;

export const { putModel } = modelApiV2.endpoints;
export const { getModel } = modelApi.endpoints;
