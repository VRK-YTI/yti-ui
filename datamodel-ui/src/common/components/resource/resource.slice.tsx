import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Resource } from '@app/common/interfaces/resource.interface';
import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import {
  ResourceFormType,
  initialAttribute,
  initialAssociation,
  initialAppAssociation,
  initialAppAttribute,
} from '@app/common/interfaces/resource-form.interface';
import { convertToPUT } from './utils';

function pathForModelType(isApplicationProfile?: boolean) {
  return isApplicationProfile ? 'profile/' : 'library/';
}

function pathForResourceType(
  type: ResourceType,
  isApplicationProfile?: boolean
) {
  if (isApplicationProfile) {
    return '';
  }
  return type === ResourceType.ATTRIBUTE ? '/attribute' : '/association';
}

export const resourceApi = createApi({
  reducerPath: 'resourceApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    accept: 'application/json',
  })),
  tagTypes: ['resource'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    putResource: builder.mutation<
      null,
      {
        modelId: string;
        data: ResourceFormType;
        resourceId?: string;
        applicationProfile?: boolean;
      }
    >({
      query: (value) => ({
        url: !value.resourceId
          ? `/resource/${pathForModelType(value.applicationProfile)}${
              value.modelId
            }${pathForResourceType(value.data.type, value.applicationProfile)}`
          : `/resource/${pathForModelType(value.applicationProfile)}${
              value.modelId
            }${pathForResourceType(
              value.data.type,
              value.applicationProfile
            )}/${value.resourceId}`,
        method: 'PUT',
        data: convertToPUT(
          value.data,
          value.resourceId ? true : false,
          value.applicationProfile
        ),
      }),
    }),
    getResource: builder.query<
      Resource,
      {
        modelId: string;
        resourceIdentifier: string;
        applicationProfile?: boolean;
      }
    >({
      query: (value) => ({
        url: `/resource/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }/${value.resourceIdentifier}`,
        method: 'GET',
      }),
    }),
    deleteResource: builder.mutation<
      string,
      { modelId: string; resourceId: string; applicationProfile?: boolean }
    >({
      query: (value) => ({
        url: `/resource/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }/${value.resourceId}`,
        method: 'DELETE',
      }),
    }),
    getResourceIdentifierFree: builder.query<
      boolean,
      {
        prefix: string;
        identifier: string;
      }
    >({
      query: (props) => ({
        url: `/resource/${props.prefix}/free-identifier/${props.identifier}`,
        method: 'GET',
      }),
    }),
  }),
});

function resourceInitialData(
  type: ResourceType,
  languages?: string[],
  initialSubResourceOf?:
    | string
    | {
        id: string;
        label: string;
        uri: string;
      },
  applicationProfile?: boolean
): ResourceFormType {
  let retValue = {} as ResourceFormType;

  if (applicationProfile) {
    const path =
      initialSubResourceOf && typeof initialSubResourceOf !== 'string'
        ? initialSubResourceOf
        : undefined;

    retValue =
      type === ResourceType.ASSOCIATION
        ? {
            ...initialAppAssociation,
            path: path,
          }
        : {
            ...initialAppAttribute,
            path: path,
          };
  } else {
    if (!initialSubResourceOf || typeof initialSubResourceOf !== 'string') {
      retValue =
        type === ResourceType.ASSOCIATION
          ? { ...initialAssociation, subResourceOf: ['owl:TopObjectProperty'] }
          : { ...initialAttribute, subResourceOf: ['owl:topDataProperty'] };
    } else {
      retValue =
        type === ResourceType.ASSOCIATION
          ? { ...initialAssociation, subResourceOf: [initialSubResourceOf] }
          : { ...initialAttribute, subResourceOf: [initialSubResourceOf] };
    }
  }

  if (languages) {
    retValue = {
      ...retValue,
      label: Object.fromEntries(languages.map((lang) => [lang, ''])),
    };
  }

  return retValue;
}

export const resourceSlice = createSlice({
  name: 'resource',
  initialState: {
    label: {},
    identifier: '',
    note: {},
    status: 'DRAFT',
    type: ResourceType.ASSOCIATION,
  } as ResourceFormType,
  reducers: {
    setResource(_state, action) {
      return action.payload;
    },
  },
});

export function selectResource() {
  return (state: AppState) => state.resource;
}

export function setResource(data: ResourceFormType): AppThunk {
  return (dispatch) => dispatch(resourceSlice.actions.setResource(data));
}

export function initializeResource(
  type: ResourceType,
  langs: string[],
  initialSubResourceOf?:
    | string
    | {
        id: string;
        label: string;
        uri: string;
      },
  applicationProfile?: boolean
): AppThunk {
  return (dispatch) =>
    dispatch(
      resourceSlice.actions.setResource(
        resourceInitialData(
          type,
          langs,
          initialSubResourceOf,
          applicationProfile
        )
      )
    );
}

export function resetResource(): AppThunk {
  return (dispatch) =>
    dispatch(
      resourceSlice.actions.setResource({
        label: {},
        identifier: '',
        note: {},
        status: 'DRAFT',
        type: ResourceType.ASSOCIATION,
      } as ResourceFormType)
    );
}

export const { putResource, getResource } = resourceApi.endpoints;

export const {
  usePutResourceMutation,
  useGetResourceQuery,
  useDeleteResourceMutation,
  useGetResourceIdentifierFreeQuery,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = resourceApi;
