import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { ServiceCategory } from '@app/common/interfaces/service-categories.interface';

export const serviceCategoriesApi = createApi({
  reducerPath: 'serviceCategoriesApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/json',
  })),
  tagTypes: ['ServiceCategories'],
  endpoints: (builder) => ({
    getServiceCategories: builder.query<ServiceCategory[], string>({
      query: (value) => ({
        url: `/frontend/service-categories?sortLang=${value}`,
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
