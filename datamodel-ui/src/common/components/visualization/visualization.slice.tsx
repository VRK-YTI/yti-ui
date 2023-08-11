import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import {
  VisualizationPutType,
  VisualizationResult,
} from '@app/common/interfaces/visualization.interface';

export const visualizationApi = createApi({
  reducerPath: 'visualizationApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['visualization'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getVisualization: builder.query<VisualizationResult, string>({
      query: (modelId) => ({
        url: `/visualization/${modelId}`,
        method: 'GET',
      }),
    }),
    putPositions: builder.mutation<
      null,
      {
        modelId: string;
        data: VisualizationPutType[];
      }
    >({
      query: (value) => ({
        url: `/visualization/${value.modelId}/positions`,
        method: 'PUT',
        data: value.data,
      }),
    }),
  }),
});

export const { getVisualization, putPositions } = visualizationApi.endpoints;

export const {
  useGetVisualizationQuery,
  usePutPositionsMutation,
  util: { getRunningQueriesThunk },
} = visualizationApi;
