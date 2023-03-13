import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { AssociationFormType } from '@app/common/interfaces/association-form.interface';
import { AttributeFormType } from '@app/common/interfaces/attribute-form.interface';

export const resourceApi = createApi({
  reducerPath: 'resourceApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/json',
  })),
  tagTypes: ['resource'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    putResource: builder.mutation<
      null,
      {
        modelId: string;
        data: AssociationFormType | AttributeFormType;
      }
    >({
      query: (value) => ({
        url: `/resource/${value.modelId}`,
        method: 'PUT',
        data: value.data,
      }),
    }),
  }),
});

export const { putResource } = resourceApi.endpoints;

export const {
  usePutResourceMutation,
  util: { getRunningQueriesThunk },
} = resourceApi;
