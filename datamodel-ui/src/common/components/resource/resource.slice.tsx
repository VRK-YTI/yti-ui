import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { AssociationFormType } from '@app/common/interfaces/association-form.interface';
import { AttributeFormType } from '@app/common/interfaces/attribute-form.interface';
import { Resource } from '@app/common/interfaces/resource.interface';

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
    getResource: builder.mutation<
      Resource,
      { modelId: string; resourceIdentifier: string }
    >({
      query: (value) => ({
        url: `/resource/${value.modelId}/${value.resourceIdentifier}`,
        method: 'GET',
      }),
    }),
    deleteResource: builder.mutation<
      string,
      { modelId: string; resourceId: string }
    >({
      query: (value) => ({
        url: `/resource/${value.modelId}/${value.resourceId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { putResource, getResource } = resourceApi.endpoints;

export const {
  usePutResourceMutation,
  useGetResourceMutation,
  useDeleteResourceMutation,
  util: { getRunningQueriesThunk },
} = resourceApi;
