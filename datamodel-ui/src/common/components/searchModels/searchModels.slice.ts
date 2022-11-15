import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { SearchModels } from '@app/common/interfaces/searchModels.interface';

export const searchModelsApi = createApi({
  reducerPath: 'searchModelsApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['serviceCategories'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getSearchModels: builder.query<SearchModels, void>({
      query: () => ({
        url: '/searchModels',
        method: 'POST',
        data: {
          pageFrom: 0,
          pageSize: 1000,
          searchResources: true,
          sortLang: 'fi',
        },
      }),
    }),
  }),
});

export const { getSearchModels } = searchModelsApi.endpoints;

export const {
  useGetSearchModelsQuery,
  util: { getRunningQueriesThunk },
} = searchModelsApi;
