import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { ServiceCategories } from '@app/common/interfaces/service-categories.interface';

export const serviceCategoriesApi = createApi({
  reducerPath: 'serviceCategoriesApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/ld+json',
  })),
  tagTypes: ['serviceCategories'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getServiceCategories: builder.query<ServiceCategories, void>({
      query: () => ({
        url: '/serviceCategories',
        method: 'GET',
      }),
    }),
  }),
});

export const { getServiceCategories } = serviceCategoriesApi.endpoints;

export const {
  useGetServiceCategoriesQuery,
  util: { getRunningQueriesThunk },
} = serviceCategoriesApi;
