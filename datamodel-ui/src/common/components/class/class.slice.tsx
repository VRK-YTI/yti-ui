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

function convertToPUT(
  data: ClassFormType,
  isEdit: boolean,
  applicationProfile?: boolean,
  basedOnNodeShape?: boolean
): object {
  const { concept, ...retVal } = data;
  const conceptURI = concept?.conceptURI;

  const ret = {
    ...retVal,
    equivalentClass: data.equivalentClass.map((eq) => eq.identifier),
    subClassOf: data.subClassOf
      .filter((soc) => soc.identifier !== 'owl:Thing')
      .map((sco) => sco.identifier),
    subject: conceptURI,
    ...(basedOnNodeShape
      ? {
          targetNode: data.targetClass?.id,
        }
      : {
          targetClass: data.targetClass?.id,
        }),
    ...(applicationProfile &&
      !basedOnNodeShape && {
        properties: [
          ...(data.association?.map((a) => a.uri) ?? []),
          ...(data.attribute?.map((a) => a.uri) ?? []),
        ],
      }),
  };

  if (applicationProfile) {
    delete ret.association;
    delete ret.attribute;
  }

  if (basedOnNodeShape) {
    delete ret.targetClass;
  }

  return isEdit
    ? Object.fromEntries(
        Object.entries(ret).filter((e) => e[0] !== 'identifier')
      )
    : ret;
}

function pathForModelType(isApplicationProfile?: boolean) {
  return isApplicationProfile ? 'profile/' : 'library/';
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
    putClass: builder.mutation<
      string,
      {
        modelId: string;
        data: ClassFormType;
        classId?: string;
        applicationProfile?: boolean;
        basedOnNodeShape?: boolean;
      }
    >({
      query: (value) => ({
        url: !value.classId
          ? `/class/${pathForModelType(value.applicationProfile)}${
              value.modelId
            }`
          : `/class/${pathForModelType(value.applicationProfile)}${
              value.modelId
            }/${value.classId}`,
        method: 'PUT',
        data: convertToPUT(
          value.data,
          value.classId ? true : false,
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
    getClassIdentifierFree: builder.query<
      boolean,
      {
        prefix: string;
        identifier: string;
      }
    >({
      query: (props) => ({
        url: `/class/${props.prefix}/free-identifier/${props.identifier}`,
        method: 'GET',
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
  useGetNodeShapesQuery,
  useDeleteClassMutation,
  useGetClassIdentifierFreeQuery,
  util: { getRunningQueriesThunk },
} = classApi;

export const { putClass, getClass, getClassMut } = classApi.endpoints;
