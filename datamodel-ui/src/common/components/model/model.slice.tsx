import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { NewModel } from '@app/common/interfaces/new-model.interface';
import {
  ModelType,
  ModelUpdatePayload,
} from '@app/common/interfaces/model.interface';
import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';

export const modelApi = createApi({
  reducerPath: 'modelApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['modelApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    putModel: builder.mutation<string, NewModel>({
      query: (value) => ({
        url: '/model',
        method: 'PUT',
        data: value,
      }),
    }),
    getModel: builder.query<ModelType, string>({
      query: (modelId) => ({
        url: `/model/${modelId}`,
        method: 'GET',
      }),
    }),
    postModel: builder.mutation<
      string,
      {
        payload: ModelUpdatePayload;
        prefix: string;
      }
    >({
      query: (value) => ({
        url: `/model/${value.prefix}`,
        method: 'POST',
        data: value.payload,
      }),
    }),
  }),
});

export const {
  usePutModelMutation,
  useGetModelQuery,
  usePostModelMutation,
  util: { getRunningQueriesThunk },
} = modelApi;

export const { putModel, getModel } = modelApi.endpoints;

const initialView = {
  search: false,
  info: {
    info: false,
    edit: false,
  },
  links: false,
  classes: {
    list: false,
    info: false,
    edit: false,
  },
  attributes: {
    list: false,
    info: false,
    edit: false,
  },
  associations: {
    list: false,
    info: false,
    edit: false,
  },
};

const initialState = {
  selected: {
    id: '',
    type: '',
  },
  hovered: {
    id: '',
    type: '',
  },
  highlighted: [],
  view: initialView,
};

export const modelSlice = createSlice({
  name: 'model',
  initialState: {
    ...initialState,
    view: {
      ...initialView,
      search: true,
    },
  },
  reducers: {
    setSelected(state, action) {
      return {
        ...state,
        selected: {
          id: action.payload.id,
          type: action.payload.type,
        },
        view: {
          ...initialView,
          [action.payload.type]: ['search', 'links'].includes(
            action.payload.type
          )
            ? true
            : {
                ...initialView[action.payload.type],
                info: true,
              },
        },
      };
    },
    setHovered(state, action) {
      return {
        ...state,
        hovered: {
          id: action.payload.id,
          type: action.payload.type,
        },
      };
    },
    setView(state, action) {
      return {
        ...state,
        view: {
          ...initialView,
          [action.payload.key]: action.payload.subkey
            ? {
                ...initialView[action.payload.key as keyof typeof initialView],
                [action.payload.subkey]: true,
              }
            : true,
        },
      };
    },
  },
});

export function selectSelected() {
  return (state: AppState) => state.model.selected;
}

export function setSelected(
  id: string,
  type: keyof typeof initialView
): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setSelected({ id, type }));
}

export function resetSelected(): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setSelected({ id: '', type: '' }));
}

export function selectHovered() {
  return (state: AppState) => state.model.hovered;
}

export function setHovered(
  id: string,
  type: keyof typeof initialView
): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setHovered({ id, type }));
}

export function resetHovered(): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setHovered({ id: '', type: '' }));
}

export function selectView(key?: keyof typeof initialView) {
  if (key) {
    return (state: AppState) => state.model.view[key];
  }

  return (state: AppState) => state.model.view;
}

export function selectCurrentViewName() {
  return (state: AppState) =>
    Object.entries(state.model.view).find((v) =>
      typeof v[1] === 'object'
        ? Object.entries(v[1]).filter(
            (val) => Object.values(val).filter((c) => c === true).length > 0
          ).length > 0
        : v[1] === true
    )?.[0] ?? 'search';
}

export function setView(
  key: keyof typeof initialState.view,
  subkey?: 'list' | 'info' | 'edit'
): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setView({ key, subkey }));
}
