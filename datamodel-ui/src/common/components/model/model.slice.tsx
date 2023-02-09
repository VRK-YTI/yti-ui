import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { NewModel } from '@app/common/interfaces/new-model.interface';
import { ModelType } from '@app/common/interfaces/model.interface';

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
    putModel: builder.mutation<string, NewModel>({
      query: (value) => ({
        url: '/model',
        method: 'PUT',
        data: value,
      }),
    }),
    getModel: builder.query<ModelType, string>({
      query: (modelId) => ({
        url: `/model/${modelId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  usePutModelMutation,
  useGetModelQuery,
  util: { getRunningQueriesThunk },
} = modelApi;

export const { putModel, getModel } = modelApi.endpoints;
