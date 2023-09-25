import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { CountsType } from '@app/common/interfaces/counts.interface';
import { UrlState } from 'yti-common-ui/utils/hooks/use-url-state';

function getUrl(urlState: UrlState) {
  const validEntries = Object.entries({
    query: urlState.q,
    language: urlState.lang ?? null,
    organizations: urlState.organization ? [urlState.organization] : [],
    groups: urlState.domain,
    type: urlState.types
      ? urlState.types.map((type) => type.toUpperCase())
      : [],
    ...(urlState.status.length === 0
      ? { status: ['VALID', 'SUGGESTED'] }
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

  const uri = `/frontend/counts?${validEntries
    .map((e) => `${e[0]}=${Array.isArray(e[1]) ? e[1].join(',') : e[1]}`)
    .join('&')}`;

  return uri;
}

export const countApi = createApi({
  reducerPath: 'count',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['count'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getCount: builder.query<
      {
        totalHitCount: number;
        counts: CountsType;
      },
      UrlState
    >({
      query: (urlState) => ({
        url: getUrl(urlState),
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCountQuery,
  util: { getRunningQueriesThunk },
} = countApi;

export const { getCount } = countApi.endpoints;
