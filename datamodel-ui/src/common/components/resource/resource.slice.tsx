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

function convertToPUT(
  data: AssociationFormType | AttributeFormType,
  isEdit: boolean
): object {
  const removeKeys: string[] = isEdit
    ? ['identifier', 'type', 'concept']
    : ['concept'];

  const ret = Object.fromEntries(
    Object.entries(data).filter((e) => !removeKeys.includes(e[0]))
  );

  if (!data.concept) {
    return ret;
  }

  return {
    ...ret,
    subject: data.concept.conceptURI,
  };
}

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
        data: AssociationFormType | AttributeFormType;
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
        data: {
          ...convertToPUT(value.data, value.resourceId ? true : false),
          domain: value.data.domain ? value.data.domain.id : '',
          range: value.data.range ? value.data.range.id : '',
        },
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
  useGetResourceIdentifierFreeQuery,
  useMakeLocalCopyPropertyShapeMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = resourceApi;
