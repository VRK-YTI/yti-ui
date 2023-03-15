import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { SearchModels } from '@app/common/interfaces/search-models.interface';
import { UrlState } from 'yti-common-ui/utils/hooks/use-url-state';

// Drops keys with "empty" values so that only needed
// values are returned to query parameters
function getParams(urlState: UrlState, lang?: string) {
  const filteredParams = Object.fromEntries(
    Object.entries({
      pageFrom: Math.max(0, (urlState.page - 1) * 50),
      pageSize: 50,
      searchResources: true,
      sortLang: lang ?? 'fi',
      query: urlState.q,
      language: urlState.lang ? urlState.lang : null,
      organizations: urlState.organization ? [urlState.organization] : [],
      groups: urlState.domain,
      type: urlState.types
        ? urlState.types.map((type) => type.toUpperCase())
        : [],
      ...(urlState.status.length === 0
        ? { status: ['VALID', 'DRAFT'] }
        : { status: urlState.status }),
    }).filter(
      (item) =>
        item[1] &&
        item[1] !== null &&
        item[1] !== undefined &&
        (Array.isArray(item[1])
          ? item[1].length > 0
          : typeof item[1] !== 'undefined')
    )
  );

  return filteredParams;
}

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
        url: '/frontend/searchModels',
        method: 'GET',
        params: getParams(props.urlState, props.lang),
      }),
    }),
  }),
});

export const { getSearchModels } = searchModelsApi.endpoints;

export const {
  useGetSearchModelsQuery,
  util: { getRunningQueriesThunk },
} = searchModelsApi;
