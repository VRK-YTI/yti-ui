import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { SearchModels } from '@app/common/interfaces/search-models.interface';
import { UrlState } from 'yti-common-ui/utils/hooks/use-url-state';
import { inUseStatusList } from '@app/common/utils/status-list';

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
      ? { status: inUseStatusList }
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

  const uri = `/frontend/search-models?${validEntries
    .map((e) => `${e[0]}=${Array.isArray(e[1]) ? e[1].join(',') : e[1]}`)
    .join('&')}`;

  return uri;
}

export const searchModelsApi = createApi({
  reducerPath: 'searchModelsApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['SearchModels'],
  endpoints: (builder) => ({
    getSearchModels: builder.query<
      SearchModels,
      { urlState: UrlState; lang: string }
    >({
      query: (props) => ({
        url: getUrl(props.urlState, props.lang),
        method: 'GET',
      }),
      providesTags: ['SearchModels'],
    }),
  }),
});

export const { getSearchModels } = searchModelsApi.endpoints;

export const {
  useGetSearchModelsQuery,
  util: { getRunningQueriesThunk },
} = searchModelsApi;
