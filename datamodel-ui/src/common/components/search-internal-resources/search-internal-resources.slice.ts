import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Status } from '@app/common/interfaces/status.interface';
import {
  SearchInternalClasses,
  SearchInternalClassesInfo,
} from '@app/common/interfaces/search-internal-classes.interface';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import { Type } from '@app/common/interfaces/type.interface';
import { inUseStatusList } from '@app/common/utils/status-list';
import { SUOMI_FI_NAMESPACE } from '@app/common/utils/get-value';

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
  extend?: boolean;
  fromVersion?: string;
  includeDraftFrom?: string[];
}

export function initialSearchData(
  sortLang: string,
  modelId: string,
  type: ResourceType,
  limitToModelType?: 'LIBRARY' | 'PROFILE',
  fromVersion?: string
): InternalResourcesSearchParams {
  return {
    query: '',
    status: inUseStatusList,
    groups: [],
    sortLang: sortLang,
    pageSize: 50,
    pageFrom: 0,
    limitToDataModel: modelId,
    limitToModelType: limitToModelType ?? 'LIBRARY',
    fromAddedNamespaces: true,
    resourceTypes: [type],
    fromVersion: fromVersion,
  };
}

function createUrl(obj: InternalResourcesSearchParams): string {
  const basePath = obj.extend
    ? '/frontend/search-internal-resources-info'
    : '/frontend/search-internal-resources';

  let baseQuery = `${basePath}?query=${obj.query}&pageSize=${
    obj.pageSize ?? 50
  }&pageFrom=${obj.pageFrom ?? 0}`;

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
      `&limitToDataModel=${SUOMI_FI_NAMESPACE}${obj.limitToDataModel}/`
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

  if (obj.fromVersion) {
    baseQuery = baseQuery.concat(`&fromVersion=${obj.fromVersion}`);
  }

  if (obj.includeDraftFrom) {
    baseQuery = baseQuery.concat(
      `&includeDraftFrom=${obj.includeDraftFrom
        .map((modelId) => `${SUOMI_FI_NAMESPACE}${modelId}/`)
        .join(',')}`
    );
  }

  return baseQuery;
}

export const searchInternalResourcesApi = createApi({
  reducerPath: 'searchInternalResourcesApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['InternalResources'],
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
      providesTags: (results, error, args) => {
        return args.resourceTypes
          ? [
              {
                type: 'InternalResources' as const,
                id:
                  args.resourceTypes.length > 0 ? args.resourceTypes[0] : 'ALL',
              },
            ]
          : ['InternalResources'];
      },
    }),
    getInternalResourcesInfo: builder.mutation<
      SearchInternalClassesInfo,
      InternalResourcesSearchParams
    >({
      query: (object) => ({
        url: createUrl(Object.assign(object, { extend: true })),
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
  useGetInternalResourcesInfoMutation,
  util: { getRunningQueriesThunk },
} = searchInternalResourcesApi;
