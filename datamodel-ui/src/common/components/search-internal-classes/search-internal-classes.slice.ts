import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Status } from '@app/common/interfaces/status.interface';
import { SearchInternalClasses } from '@app/common/interfaces/search-internal-classes.interface';

export interface InternalClassesSearchParams {
  query: string;
  status?: Status[];
  groups?: string[];
  fromAddedNamespaces?: string;
  sortLang?: string;
  pageSize?: number;
  pageFrom?: number;
}

function createUrl(obj: InternalClassesSearchParams): string {
  let baseQuery = `/frontend/searchInternalClasses?query=${
    obj.query
  }&pageSize=${obj.pageSize ?? 50}&pageFrom=${obj.pageFrom ?? 0}`;

  if (obj.sortLang) {
    baseQuery = baseQuery.concat(`&sortLang=${obj.sortLang}`);
  }

  if (obj.status && obj.status.length > 0) {
    baseQuery = baseQuery.concat(`&status=${obj.status.join(',')}`);
  }

  if (obj.groups && obj.groups.length > 0) {
    baseQuery = baseQuery.concat(`&groups=${obj.groups.join(',')}`);
  }

  if (obj.fromAddedNamespaces) {
    baseQuery = baseQuery.concat(
      `&fromAddedNamespaces=${obj.fromAddedNamespaces}`
    );
  }

  return baseQuery;
}

export const searchInternalClassesApi = createApi({
  reducerPath: 'searchInternalClassesApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['internalClasses'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getInternalClasses: builder.mutation<
      SearchInternalClasses,
      InternalClassesSearchParams
    >({
      query: (object) => ({
        url: createUrl(object),
        method: 'GET',
      }),
    }),
  }),
});

export const { getInternalClasses } = searchInternalClassesApi.endpoints;

export const {
  useGetInternalClassesMutation,
  util: { getRunningQueriesThunk },
} = searchInternalClassesApi;
