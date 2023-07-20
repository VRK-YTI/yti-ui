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
import { convertToPayload, pathForResourceType } from './utils';
import { pathForModelType } from '@app/common/utils/api-utils';

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
        }${pathForResourceType(value.data.type, value.applicationProfile)}/${
          value.data.identifier
        }`,
        method: 'PUT',
        data: convertToPayload(value.data, true, value.applicationProfile),
      }),
    }),
    createResource: builder.mutation<null, ResourceData>({
      query: (value) => ({
        url: `/resource/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }${pathForResourceType(value.data.type, value.applicationProfile)}`,
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
        url: `/resource/profile/${value.modelid}/${value.resourceId}?targetPrefix=${value.targetPrefix}&newIdentifier=${value.newIdentifier}`,
        method: 'POST',
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
          ? {
              ...initialAssociation,
              subResourceOf: [
                {
                  label: 'owl:TopObjectProperty',
                  uri: 'owl:TopObjectProperty',
                },
              ],
            }
          : {
              ...initialAttribute,
              subResourceOf: [
                {
                  label: 'owl:topDataProperty',
                  uri: 'owl:topDataProperty',
                },
              ],
            };
    } else {
      retValue =
        type === ResourceType.ASSOCIATION
          ? {
              ...initialAssociation,
              subResourceOf: [
                {
                  label: initialSubResourceOf,
                  uri: initialSubResourceOf,
                },
              ],
            }
          : {
              ...initialAttribute,
              subResourceOf: [
                {
                  label: initialSubResourceOf,
                  uri: initialSubResourceOf,
                },
              ],
            };
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

export const { updateResource, createResource, getResource } =
  resourceApi.endpoints;

export const {
  useUpdateResourceMutation,
  useCreateResourceMutation,
  useGetResourceQuery,
  useDeleteResourceMutation,
  useGetResourceExistsQuery,
  useMakeLocalCopyPropertyShapeMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = resourceApi;
