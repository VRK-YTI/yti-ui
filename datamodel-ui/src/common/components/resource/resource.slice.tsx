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
import {
  DEFAULT_ASSOCIATION_SUBPROPERTY,
  DEFAULT_ATTRIBUTE_SUBPROPERTY,
  convertToPayload,
  pathForResourceType,
} from './utils';
import { pathForModelType } from '@app/common/utils/api-utils';
import { UriData } from '@app/common/interfaces/uri.interface';

interface ResourceData {
  modelId: string;
  data: ResourceFormType;
  applicationProfile?: boolean;
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
    updateResource: builder.mutation<null, ResourceData>({
      query: (value) => ({
        url: `/resource/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }${pathForResourceType(value.data.type)}/${value.data.identifier}`,
        method: 'PUT',
        data: convertToPayload(value.data, true, value.applicationProfile),
      }),
    }),
    createResource: builder.mutation<null, ResourceData>({
      query: (value) => ({
        url: `/resource/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }${pathForResourceType(value.data.type)}`,
        method: 'POST',
        data: convertToPayload(value.data, false, value.applicationProfile),
      }),
    }),
    getResource: builder.query<
      Resource,
      {
        modelId: string;
        resourceIdentifier: string;
        applicationProfile?: boolean;
        version?: string;
      }
    >({
      query: (value) => ({
        url: `/resource/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }/${value.resourceIdentifier}`,
        params: {
          ...(value.version && { version: value.version }),
        },
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
    getResourceExists: builder.query<
      boolean,
      {
        prefix: string;
        identifier: string;
      }
    >({
      query: (props) => ({
        url: `/resource/${props.prefix}/${props.identifier}/exists`,
        method: 'GET',
      }),
    }),
    getResourceActive: builder.query<
      boolean,
      { prefix: string; uri: string; version?: string }
    >({
      query: (props) => ({
        url: `/resource/profile/${props.prefix}/active?uri=${props.uri}`,
        params: {
          ...(props.version && { version: props.version }),
        },
        method: 'GET',
      }),
    }),
    togglePropertyShape: builder.mutation<
      string,
      { modelId: string; uri: string }
    >({
      query: (props) => ({
        url: `/class/toggle-deactivate/${props.modelId}?propertyUri=${props.uri}`,
        method: 'PUT',
      }),
    }),
    makeLocalCopyPropertyShape: builder.mutation<
      null,
      {
        modelid: string;
        resourceId: string;
        targetPrefix: string;
        newIdentifier: string;
      }
    >({
      query: (value) => ({
        url: `/resource/profile/${value.modelid}/${value.resourceId}/copy?targetPrefix=${value.targetPrefix}&newIdentifier=${value.newIdentifier}`,
        method: 'POST',
      }),
    }),
  }),
});

function resourceInitialData(
  type: ResourceType,
  languages?: string[],
  initialReferenceResource?: UriData,
  applicationProfile?: boolean
): ResourceFormType {
  let retValue = {} as ResourceFormType;

  if (applicationProfile) {
    retValue =
      type === ResourceType.ASSOCIATION
        ? {
            ...initialAppAssociation,
            path: initialReferenceResource,
          }
        : {
            ...initialAppAttribute,
            path: initialReferenceResource,
          };
  } else {
    retValue =
      type === ResourceType.ASSOCIATION
        ? {
            ...initialAssociation,
            label: initialReferenceResource?.label ?? {},
            subResourceOf: [
              initialReferenceResource ?? DEFAULT_ASSOCIATION_SUBPROPERTY,
            ],
          }
        : {
            ...initialAttribute,
            label: initialReferenceResource?.label ?? {},
            subResourceOf: [
              initialReferenceResource ?? DEFAULT_ATTRIBUTE_SUBPROPERTY,
            ],
          };
  }

  if (languages) {
    retValue = {
      ...retValue,
      label: Object.fromEntries(
        languages.map((lang) => [lang, retValue.label[lang] ?? ''])
      ),
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
  initialReferenceResource?: UriData,
  applicationProfile?: boolean
): AppThunk {
  return (dispatch) =>
    dispatch(
      resourceSlice.actions.setResource(
        resourceInitialData(
          type,
          langs,
          initialReferenceResource,
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

export const { updateResource, createResource, getResource } =
  resourceApi.endpoints;

export const {
  useUpdateResourceMutation,
  useCreateResourceMutation,
  useGetResourceQuery,
  useDeleteResourceMutation,
  useGetResourceExistsQuery,
  useGetResourceActiveQuery,
  useTogglePropertyShapeMutation,
  useMakeLocalCopyPropertyShapeMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = resourceApi;
