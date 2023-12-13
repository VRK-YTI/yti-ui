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
  tagTypes: ['Resource'],
  endpoints: (builder) => ({
    updateResource: builder.mutation<null, ResourceData>({
      query: (value) => ({
        url: `/resource/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }${pathForResourceType(value.data.type)}/${value.data.identifier}`,
        method: 'PUT',
        data: convertToPayload(value.data, true, value.applicationProfile),
      }),
      invalidatesTags: ['Resource'],
    }),
    createResource: builder.mutation<null, ResourceData>({
      query: (value) => ({
        url: `/resource/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }${pathForResourceType(value.data.type)}`,
        method: 'POST',
        data: convertToPayload(value.data, false, value.applicationProfile),
      }),
      invalidatesTags: ['Resource'],
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
      providesTags: ['Resource'],
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
      providesTags: ['Resource'],
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
      providesTags: ['Resource'],
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
      invalidatesTags: ['Resource'],
    }),
    renameResource: builder.mutation<
      string,
      {
        prefix: string;
        identifier: string;
        newIdentifier: string;
      }
    >({
      query: (value) => ({
        url: `/resource/${value.prefix}/${value.identifier}/rename`,
        params: {
          newIdentifier: value.newIdentifier,
        },
        method: 'POST',
      }),
      invalidatesTags: ['Resource'],
    }),
  }),
});

function resourceInitialData(
  type: ResourceType,
  initialReferenceResource?: UriData,
  applicationProfile?: boolean
): ResourceFormType {
  if (applicationProfile) {
    const initialData =
      type === ResourceType.ASSOCIATION
        ? initialAppAssociation
        : initialAppAttribute;
    return {
      ...initialData,
      path: initialReferenceResource,
    };
  } else {
    if (type === ResourceType.ASSOCIATION) {
      return {
        ...initialAssociation,
        subResourceOf: [
          initialReferenceResource ?? DEFAULT_ASSOCIATION_SUBPROPERTY,
        ],
      };
    }
    return {
      ...initialAttribute,
      subResourceOf: [
        initialReferenceResource ?? DEFAULT_ATTRIBUTE_SUBPROPERTY,
      ],
    };
  }
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
  return (state: AppState): ResourceFormType => state.resource;
}

export function setResource(data: ResourceFormType): AppThunk {
  return (dispatch) => dispatch(resourceSlice.actions.setResource(data));
}

export function initializeResource(
  type: ResourceType,
  initialReferenceResource?: UriData,
  applicationProfile?: boolean
): AppThunk {
  return (dispatch) =>
    dispatch(
      resourceSlice.actions.setResource(
        resourceInitialData(type, initialReferenceResource, applicationProfile)
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
  useRenameResourceMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = resourceApi;
