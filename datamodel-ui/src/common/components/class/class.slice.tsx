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
    putClass: builder.mutation<string, { modelId: string; data: ClassType }>({
      query: (value) => ({
        url: `/class/${value.modelId}`,
        method: 'PUT',
        data: value.data,
      }),
    }),
    getClass: builder.query<ClassType, { modelId: string; classId: string }>({
      query: (value) => ({
        url: `/class/${value.modelId}/${value.classId}`,
        method: 'GET',
      }),
    }),
    getClassMut: builder.mutation<
      ClassType,
      { modelId: string; classId: string }
    >({
      query: (value) => ({
        url: `/class/${value.modelId}/${value.classId}`,
        method: 'GET',
      }),
    }),
    deleteClass: builder.mutation<string, { modelId: string; classId: string }>(
      {
        query: (value) => ({
          url: `/class/${value.modelId}/${value.classId}`,
          method: 'DELETE',
        }),
      }
    ),
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
  // extraReducers: (builder) => {
  //   builder.addMatcher(
  //     classApi.endpoints.getClass.matchFulfilled, (state, action) => {
  //       if (isEqual(state, action.payload)) {
  //         return state;
  //       }
  //       return action.payload;
  //     }
  //   );
  //   builder.addMatcher(isHydrate, (_, action) => {
  //     return action.payload.model;
  //   });
  // }
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
  usePutClassMutation,
  useGetClassQuery,
  useGetClassMutMutation,
  useDeleteClassMutation,
  util: { getRunningQueriesThunk },
} = classApi;

export const { putClass, getClass, getClassMut } = classApi.endpoints;
