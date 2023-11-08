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
  endpoints: (builder) => ({
    getVisualization: builder.query<
      VisualizationResult,
      { modelid: string; version?: string }
    >({
      query: (value) => ({
        url: `/visualization/${value.modelid}`,
        params: {
          ...(value.version && {
            version: value.version,
          }),
        },
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
