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

function convertToPUT(data: AssociationFormType | AttributeFormType): object {
  if (!data.concept) {
    return data;
  }

  const retVal = {
    ...data,
    subject: data.concept.conceptURI,
  };

  delete retVal['concept'];

  return retVal;
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
        data: AssociationFormType | AttributeFormType;
      }
    >({
      query: (value) => ({
        url: `/resource/${value.modelId}`,
        method: 'PUT',
        data:
          value.data.type === ResourceType.ATTRIBUTE
            ? {
                ...convertToPUT(value.data),
                domain: value.data.domain ? value.data.domain.id : '',
                range: '',
              }
            : {
                ...convertToPUT(value.data),
                domain: value.data.domain ? value.data.domain.id : '',
                range: value.data.range ? value.data.range.id : '',
              },
      }),
    }),
    getResource: builder.query<
      Resource,
      { modelId: string; resourceIdentifier: string }
    >({
      query: (value) => ({
        url: `/resource/${value.modelId}/${value.resourceIdentifier}`,
        method: 'GET',
      }),
    }),
    deleteResource: builder.mutation<
      string,
      { modelId: string; resourceId: string }
    >({
      query: (value) => ({
        url: `/resource/${value.modelId}/${value.resourceId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

function resourceInitialData(
  type: ResourceType,
  languages?: string[],
  initialSubResourceOf?: string
): AssociationFormType | AttributeFormType {
  let retValue = {} as AssociationFormType | AttributeFormType;

  if (!initialSubResourceOf) {
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
  langs: string[],
  initialSubResourceOf?: string
): AppThunk {
  return (dispatch) =>
    dispatch(
      resourceSlice.actions.setResource(
        resourceInitialData(type, langs, initialSubResourceOf)
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
  useGetResourceQuery,
  useDeleteResourceMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = resourceApi;
