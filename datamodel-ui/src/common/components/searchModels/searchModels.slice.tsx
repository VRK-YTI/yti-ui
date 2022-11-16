import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { SearchModels } from '@app/common/interfaces/searchModels.interface';
import { UrlState } from 'yti-common-ui/utils/hooks/use-url-state';

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
    getSearchModels: builder.query<SearchModels, { urlState: UrlState }>({
      query: (props) => ({
        url: '/searchModels',
        method: 'POST',
        data: {
          pageFrom: 0,
          pageSize: 1000,
          searchResources: true,
          sortLang: 'fi',
          query: props.urlState.q,
          language: props.urlState.lang ? props.urlState.lang : null,
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
