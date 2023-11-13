import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import { Identifier } from '@app/common/interfaces/termed-data-types.interface';

export const removeApi = createApi({
  reducerPath: 'removeApi',
  baseQuery: getTerminologyApiBaseQuery(),
  tagTypes: ['Remove'],
  endpoints: (builder) => ({
    deleteTarget: builder.mutation<null, Identifier<string>[]>({
      query: (data) => ({
        url: '/remove?sync=true&disconnect=true',
        method: 'DELETE',
        data: data,
      }),
    }),
  }),
});

export const { useDeleteTargetMutation } = removeApi;
