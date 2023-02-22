import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { ClassType } from '@app/common/interfaces/class.interface';
import { NewClass } from '@app/common/interfaces/new-class.interface';

export const classApi = createApi({
  reducerPath: 'class',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['class'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    putClass: builder.mutation<string, { modelId: string; data: NewClass }>({
      query: (value) => ({
        url: `/class/${value.modelId}`,
        method: 'PUT',
        data: value.data,
      }),
    }),
    getClass: builder.query<ClassType, { modelId: string; classId: string }>({
      query: (value) => ({
        url: `/class/${value.modelId}/${value.classId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  usePutClassMutation,
  useGetClassQuery,
  util: { getRunningQueriesThunk },
} = classApi;

export const { putClass, getClass } = classApi.endpoints;
