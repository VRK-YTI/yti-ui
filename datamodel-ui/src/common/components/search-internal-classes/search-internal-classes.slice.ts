import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Status } from '@app/common/interfaces/status.interface';
import { SearchInternalClasses } from '@app/common/interfaces/search-internal-classes.interface';

interface getInternalClassesType {
  query: string;
  status?: Status[];
  groups?: string[];
  fromAddedNamespaces?: string;
  sortLang?: string;
  pageSize?: number;
  pageFrom?: number;
}

function createUrl(obj: getInternalClassesType): string {
  return `/frontend/searchInternalClasses?query=${obj.query}&pageSize=${
    obj.pageSize ?? 50
  }&pageFrom=${obj.pageFrom ?? 0}`;
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
      getInternalClassesType
    >({
      query: (object) => ({
        url: '/frontend/searchInternalClasses',
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
