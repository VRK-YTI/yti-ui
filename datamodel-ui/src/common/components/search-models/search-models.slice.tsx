import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { SearchModels } from '@app/common/interfaces/search-models.interface';
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
    getSearchModels: builder.query<
      SearchModels,
      { urlState: UrlState; lang: string }
    >({
      query: (props) => ({
        url: '/searchModels',
        method: 'POST',
        data: {
          pageFrom: 0,
          pageSize: 1000,
          searchResources: true,
          sortLang: props.lang ?? 'fi',
          query: props.urlState.q,
          language: props.urlState.lang ? props.urlState.lang : null,
          organizations: props.urlState.organization
            ? [props.urlState.organization]
            : [],
          groups: props.urlState.domain,
          type: props.urlState.types ?? [],
          ...(props.urlState.status.length === 0
            ? { status: ['VALID', 'DRAFT'] }
            : { status: props.urlState.status }),
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
