import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Status } from '@app/common/interfaces/status.interface';
import { SearchInternalClasses } from '@app/common/interfaces/search-internal-classes.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Type } from '@app/common/interfaces/type.interface';

export interface InternalResourcesSearchParams {
  query: string;
  resourceTypes: ResourceType[];
  status?: Status[];
  groups?: string[];
  fromAddedNamespaces?: boolean;
  limitToDataModel?: string;
  sortLang?: string;
  pageSize?: number;
  pageFrom?: number;
  limitToModelType?: Type;
}

function createUrl(obj: InternalResourcesSearchParams): string {
  let baseQuery = `/frontend/searchInternalResources?query=${
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

  if (obj.limitToDataModel) {
    baseQuery = baseQuery.concat(
      `&limitToDataModel=http://uri.suomi.fi/datamodel/ns/${obj.limitToDataModel}`
    );
  }

  if (obj.fromAddedNamespaces) {
    baseQuery = baseQuery.concat(
      `&fromAddedNamespaces=${obj.fromAddedNamespaces}`
    );
  }

  if (obj.resourceTypes) {
    baseQuery = baseQuery.concat(
      `&resourceTypes=${obj.resourceTypes.join(',')}`
    );
  }

  if (obj.limitToModelType) {
    baseQuery = baseQuery.concat(`&limitToModelType=${obj.limitToModelType}`);
  }

  return baseQuery;
}

export const searchInternalResourcesApi = createApi({
  reducerPath: 'searchInternalResourcesApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['internalResources'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getInternalResources: builder.mutation<
      SearchInternalClasses,
      InternalResourcesSearchParams
    >({
      query: (object) => ({
        url: createUrl(object),
        method: 'GET',
      }),
    }),
    queryInternalResources: builder.query<
      SearchInternalClasses,
      InternalResourcesSearchParams
    >({
      query: (object) => ({
        url: createUrl(object),
        method: 'GET',
      }),
    }),
  }),
});

export const { getInternalResources, queryInternalResources } =
  searchInternalResourcesApi.endpoints;

export const {
  useGetInternalResourcesMutation,
  useQueryInternalResourcesQuery,
  util: { getRunningQueriesThunk },
} = searchInternalResourcesApi;
