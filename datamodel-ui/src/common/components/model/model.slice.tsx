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
import isHydrate from '@app/store/isHydrate';

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
        url: `/model/${value.type === 'LIBRARY' ? 'library' : 'profile'}`,
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
        isApplicationProfile: boolean;
      }
    >({
      query: (value) => ({
        url: `/model/${value.isApplicationProfile ? 'profile' : 'library'}/${
          value.prefix
        }`,
        method: 'POST',
        data: value.payload,
      }),
    }),
    deleteModel: builder.mutation<string, string>({
      query: (value) => ({
        url: `/model/${value}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  usePutModelMutation,
  useGetModelQuery,
  usePostModelMutation,
  useDeleteModelMutation,
  util: { getRunningQueriesThunk },
} = modelApi;

export const { putModel, getModel, postModel, deleteModel } =
  modelApi.endpoints;

// Slice setup below

export type ViewListItem = {
  edit: boolean;
  info: boolean;
  list: boolean;
};

export interface ViewList {
  search: boolean;
  links: boolean;
  graph: boolean;
  documentation: boolean;
  info: {
    edit: boolean;
    info: boolean;
  };
  classes: ViewListItem;
  attributes: ViewListItem;
  associations: ViewListItem;
}

const initialView: ViewList = {
  search: false,
  graph: false,
  links: false,
  documentation: false,
  info: {
    info: false,
    edit: false,
  },
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
    modelId: null,
  },
  hovered: {
    id: '',
    type: '',
  },
  highlighted: [],
  view: initialView,
  hasChanges: false,
  displayWarning: false,
};

export const modelSlice = createSlice({
  name: 'model',
  initialState: {
    ...initialState,
    view: {
      ...initialView,
      info: {
        info: true,
        edit: false,
      },
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isHydrate, (state, action) => {
      return {
        ...state,
        ...action.payload.model,
      };
    });
  },
  reducers: {
    setSelected(state, action) {
      return {
        ...state,
        selected: {
          id: action.payload.id,
          type: action.payload.type,
          modelId: action.payload.modelId,
        },
        view: {
          ...initialView,
          [action.payload.type]: ['search', 'links'].includes(
            action.payload.type
          )
            ? true
            : {
                ...(initialView[
                  action.payload.type as keyof typeof initialView
                ] as object),
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
          [action.payload.key]:
            typeof initialView[
              action.payload.key as keyof typeof initialView
            ] !== 'boolean' && action.payload.subkey
              ? {
                  ...(initialView[
                    action.payload.key as keyof typeof initialView
                  ] as object),
                  [action.payload.subkey]: true,
                }
              : true,
        },
      };
    },
    setHasChanges(state, action) {
      if (action.payload === false) {
        return {
          ...state,
          hasChanges: action.payload,
          displayWarning: false,
        };
      }
      return {
        ...state,
        hasChanges: action.payload,
      };
    },
    setDisplayWarning(state, action) {
      if (action.payload === true && state.hasChanges === true) {
        return {
          ...state,
          displayWarning: action.payload,
        };
      }
    },
  },
});

export function selectSelected() {
  return (state: AppState) => state.model.selected;
}

export function setSelected(
  id: string,
  type: keyof typeof initialView,
  modelId?: string
): AppThunk {
  console.info('set selected', id, modelId);
  return (dispatch) =>
    dispatch(modelSlice.actions.setSelected({ id, type, modelId }));
}

export function resetSelected(): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setSelected({ id: '', type: '' }));
}

export function selectHovered() {
  return (state: AppState) => state.model.hovered;
}

export function setHovered(id: string, type: keyof ViewList): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setHovered({ id, type }));
}

export function resetHovered(): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setHovered({ id: '', type: '' }));
}

export function selectViews() {
  return (state: AppState) => state.model.view;
}

export function selectClassView() {
  return (state: AppState) => state.model.view.classes;
}

export function selectResourceView(type: 'associations' | 'attributes') {
  return (state: AppState) => state.model.view[type];
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
  key: keyof ViewList,
  subkey?: keyof ViewListItem
): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setView({ key, subkey }));
}

export function setHasChanges(hasChanges?: boolean): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setHasChanges(hasChanges ?? false));
}

export function displayWarning(): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setDisplayWarning(true));
}

export function selectHasChanges() {
  return (state: AppState) => state.model.hasChanges;
}

export function selectDisplayWarning() {
  return (state: AppState) => state.model.displayWarning;
}
