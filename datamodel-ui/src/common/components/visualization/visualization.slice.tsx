import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import {
  VisualizationPutType,
  VisualizationResult,
} from '@app/common/interfaces/visualization.interface';

export const visualizationApi = createApi({
  reducerPath: 'visualizationApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Visualization'],
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
      providesTags: ['Visualization'],
    }),
    putPositions: builder.mutation<
      null,
      {
        modelId: string;
        version?: string;
        data: VisualizationPutType[];
      }
    >({
      query: (value) => ({
        url: `/visualization/${value.modelId}/positions${
          value.version ? `?version=${value.version}` : ''
        }`,
        method: 'PUT',
        data: value.data,
      }),
      invalidatesTags: ['Visualization'],
    }),
  }),
});

export const { getVisualization, putPositions } = visualizationApi.endpoints;

export const {
  useGetVisualizationQuery,
  usePutPositionsMutation,
  util: { getRunningQueriesThunk },
} = visualizationApi;
