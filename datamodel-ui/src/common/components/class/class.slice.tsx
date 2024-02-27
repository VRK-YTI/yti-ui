import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { ClassType } from '@app/common/interfaces/class.interface';
import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import {
  ClassFormType,
  initialClassForm,
} from '@app/common/interfaces/class-form.interface';
import { InternalClassInfo } from '@app/common/interfaces/internal-class.interface';
import { pathForModelType } from '@app/common/utils/api-utils';
import { convertToPayload } from './utils';

interface ClassData {
  modelId: string;
  data: ClassFormType;
  applicationProfile?: boolean;
  basedOnNodeShape?: boolean;
}

export const classApi = createApi({
  reducerPath: 'classApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Class'],
  endpoints: (builder) => ({
    updateClass: builder.mutation<string, ClassData>({
      query: (value) => ({
        url: `/class/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }/${value.data.identifier}`,
        method: 'PUT',
        data: convertToPayload(
          value.data,
          true,
          value.applicationProfile,
          value.basedOnNodeShape
        ),
      }),
      invalidatesTags: ['Class'],
    }),
    createClass: builder.mutation<null, ClassData>({
      query: (value) => ({
        url: `/class/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }`,
        method: 'POST',
        data: convertToPayload(
          value.data,
          false,
          value.applicationProfile,
          value.basedOnNodeShape
        ),
      }),
    }),
    getClass: builder.query<
      ClassType,
      {
        modelId: string;
        version?: string;
        classId: string;
        applicationProfile?: boolean;
      }
    >({
      query: (value) => ({
        url: `/class/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }/${value.classId}`,
        params: {
          ...(value.version && {
            version: value.version,
          }),
        },
        method: 'GET',
      }),
      providesTags: ['Class'],
    }),
    getNodeShapes: builder.query<InternalClassInfo[], string>({
      query: (targetClass) => ({
        url: `/class/nodeshapes?targetClass=${targetClass}`,
        method: 'GET',
      }),
    }),
    deleteClass: builder.mutation<
      string,
      { modelId: string; classId: string; applicationProfile?: boolean }
    >({
      query: (value) => ({
        url: `/class/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }/${value.classId}`,
        method: 'DELETE',
      }),
    }),
    getClassExists: builder.query<
      boolean,
      {
        prefix: string;
        identifier: string;
      }
    >({
      query: (props) => ({
        url: `/class/${props.prefix}/${props.identifier}/exists`,
        method: 'GET',
      }),
    }),
    addPropertyReference: builder.mutation<
      string,
      {
        prefix: string;
        identifier: string;
        uri: string;
        applicationProfile: boolean;
      }
    >({
      query: (value) => ({
        url: `/class/${pathForModelType(value.applicationProfile)}${
          value.prefix
        }/${value.identifier}/properties`,
        params: {
          uri: value.uri,
        },
        method: 'PUT',
      }),
      invalidatesTags: ['Class'],
    }),
    deletePropertyReference: builder.mutation<
      string,
      {
        prefix: string;
        identifier: string;
        uri: string;
        currentTarget?: string;
        applicationProfile: boolean;
      }
    >({
      query: (value) => ({
        url: `/class/${pathForModelType(value.applicationProfile)}${
          value.prefix
        }/${value.identifier}/properties`,
        params: {
          uri: value.uri,
          currentTarget: value.currentTarget,
        },
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),
    updateClassResrictionTarget: builder.mutation<
      string,
      {
        prefix: string;
        identifier: string;
        uri: string;
        currentTarget?: string;
        newTarget?: string;
      }
    >({
      query: (value) => ({
        url: `/class/library/${value.prefix}/${value.identifier}/properties/modify`,
        params: {
          uri: value.uri,
          currentTarget: value.currentTarget,
          newTarget: value.newTarget,
        },
        method: 'PUT',
      }),
      invalidatesTags: ['Class'],
    }),
    renameClass: builder.mutation<
      string,
      {
        prefix: string;
        identifier: string;
        newIdentifier: string;
      }
    >({
      query: (value) => ({
        url: `/class/${value.prefix}/${value.identifier}/rename`,
        params: {
          newIdentifier: value.newIdentifier,
        },
        method: 'POST',
      }),
      invalidatesTags: ['Class'],
    }),
  }),
});

export const classSlice = createSlice({
  name: 'class',
  initialState: initialClassForm,
  reducers: {
    setClass(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export function selectClass() {
  return (state: AppState): ClassFormType => state.class;
}

export function setClass(data: ClassFormType): AppThunk {
  return (dispatch) => dispatch(classSlice.actions.setClass(data));
}

export function resetClass(): AppThunk {
  return (dispatch) => dispatch(classSlice.actions.setClass(initialClassForm));
}

export const {
  useUpdateClassMutation,
  useCreateClassMutation,
  useGetClassQuery,
  useGetNodeShapesQuery,
  useDeleteClassMutation,
  useGetClassExistsQuery,
  useAddPropertyReferenceMutation,
  useDeletePropertyReferenceMutation,
  useRenameClassMutation,
  useUpdateClassResrictionTargetMutation,
  util: { getRunningQueriesThunk },
} = classApi;

export const { updateClass, createClass, getClass } = classApi.endpoints;
