import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { ClassType } from '@app/common/interfaces/class.interface';
import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import {
  ClassFormType,
  initialClassForm,
} from '@app/common/interfaces/class-form.interface';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';
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
  tagTypes: ['classApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
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
      { modelId: string; classId: string; applicationProfile?: boolean }
    >({
      query: (value) => ({
        url: `/class/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }/${value.classId}`,
        method: 'GET',
      }),
    }),
    getClassMut: builder.mutation<
      ClassType,
      { modelId: string; classId: string; applicationProfile?: boolean }
    >({
      query: (value) => ({
        url: `/class/${pathForModelType(value.applicationProfile)}${
          value.modelId
        }/${value.classId}`,
        method: 'GET',
      }),
    }),
    getNodeShapes: builder.query<InternalClass[], string>({
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
    addNodeShapePropertyReference: builder.mutation<
      string,
      { prefix: string; nodeshapeId: string; uri: string }
    >({
      query: (value) => ({
        url: `/class/profile/${value.prefix}/${value.nodeshapeId}/properties`,
        params: {
          uri: value.uri,
        },
        method: 'PUT',
      }),
    }),
    deleteNodeShapePropertyReference: builder.mutation<
      string,
      { prefix: string; nodeshapeId: string; uri: string }
    >({
      query: (value) => ({
        url: `/class/profile/${value.prefix}/${value.nodeshapeId}/properties`,
        params: {
          uri: value.uri,
        },
        method: 'DELETE',
      }),
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
  useGetClassMutMutation,
  useGetNodeShapesQuery,
  useDeleteClassMutation,
  useGetClassExistsQuery,
  useAddNodeShapePropertyReferenceMutation,
  useDeleteNodeShapePropertyReferenceMutation,
  util: { getRunningQueriesThunk },
} = classApi;

export const { updateClass, createClass, getClass, getClassMut } =
  classApi.endpoints;
