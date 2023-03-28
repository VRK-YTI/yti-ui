import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import {
  AssociationFormType,
  initialAssociation,
} from '@app/common/interfaces/association-form.interface';
import {
  AttributeFormType,
  initialAttribute,
} from '@app/common/interfaces/attribute-form.interface';
import { Resource } from '@app/common/interfaces/resource.interface';
import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';

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
        data: AssociationFormType | AttributeFormType;
      }
    >({
      query: (value) => ({
        url: `/resource/${value.modelId}`,
        method: 'PUT',
        data: value.data,
      }),
    }),
    getResource: builder.mutation<
      Resource,
      { modelId: string; resourceIdentifier: string }
    >({
      query: (value) => ({
        url: `/resource/${value.modelId}/${value.resourceIdentifier}`,
        method: 'GET',
      }),
    }),
  }),
});

function resourceInitialData(
  type: ResourceType,
  initialSubResourceOf?: string
): AssociationFormType | AttributeFormType {
  if (!initialSubResourceOf) {
    return type === ResourceType.ASSOCIATION
      ? { ...initialAssociation, subResourceOf: ['owl:TopObjectProperty'] }
      : { ...initialAttribute, subResourceOf: ['owl:topDataProperty'] };
  }

  return type === ResourceType.ASSOCIATION
    ? { ...initialAssociation, subResourceOf: [initialSubResourceOf] }
    : { ...initialAttribute, subResourceOf: [initialSubResourceOf] };
}

export const resourceSlice = createSlice({
  name: 'resource',
  initialState: resourceInitialData(ResourceType.ASSOCIATION),
  reducers: {
    setResource(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export function selectResource() {
  return (state: AppState) => state.resource;
}

export function setResource(
  data: AssociationFormType | AttributeFormType
): AppThunk {
  return (dispatch) => dispatch(resourceSlice.actions.setResource(data));
}

export function initializeResource(
  type: ResourceType,
  initialSubResourceOf?: string
): AppThunk {
  return (dispatch) =>
    dispatch(
      resourceSlice.actions.setResource(
        resourceInitialData(type, initialSubResourceOf)
      )
    );
}

export function resetResource(): AppThunk {
  return (dispatch) =>
    dispatch(resourceSlice.actions.setResource(initialAssociation));
}

export const { putResource, getResource } = resourceApi.endpoints;

export const {
  usePutResourceMutation,
  useGetResourceMutation,
  util: { getRunningQueriesThunk },
} = resourceApi;
