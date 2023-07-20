import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { VisualizationResult } from '@app/common/interfaces/visualization.interface';

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
  }),
});

export const { getVisualization } = visualizationApi.endpoints;

export const {
  useGetVisualizationQuery,
  util: { getRunningQueriesThunk },
} = visualizationApi;
