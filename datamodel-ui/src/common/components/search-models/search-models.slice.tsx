import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { SearchModels } from '@app/common/interfaces/search-models.interface';
import { UrlState } from 'yti-common-ui/utils/hooks/use-url-state';

/*
  Drops keys with "empty" values in urlState
  so that only needed parameters are added to url

  Note! This could be theoretically done with RTK's
  params like so:

    query: (props) => ({
      url: '/frontend/searchModels',
      method: 'GET',
      params: getParams(props.urlState, props.lang)
    }),

  but it seems to break the SSR.
*/
function getUrl(urlState: UrlState, lang?: string) {
  const validEntries = Object.entries({
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
  );

  const uri = `/frontend/searchModels?${validEntries
    .map((e) => `${e[0]}=${Array.isArray(e[1]) ? e[1].join(',') : e[1]}`)
    .join('&')}`;

  return uri;
}

export const searchModelsApi = createApi({
  reducerPath: 'searchModelsApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['searchModels'],
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
        url: getUrl(props.urlState, props.lang),
        method: 'GET',
      }),
    }),
  }),
});

export const { getSearchModels } = searchModelsApi.endpoints;

export const {
  useGetSearchModelsQuery,
  util: { getRunningQueriesThunk },
} = searchModelsApi;
