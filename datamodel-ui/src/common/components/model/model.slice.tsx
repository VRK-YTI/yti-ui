import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { NewModel } from '@app/common/interfaces/new-model.interface';
import {
  ModelType,
  ModelUpdatePayload,
  VersionedModelUpdatePayload,
} from '@app/common/interfaces/model.interface';
import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';

export const modelApi = createApi({
  reducerPath: 'modelApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Model'],
  endpoints: (builder) => ({
    createModel: builder.mutation<string, NewModel>({
      query: (value) => ({
        url: `/model/${value.type === 'LIBRARY' ? 'library' : 'profile'}`,
        method: 'POST',
        data: value,
      }),
    }),
    getModel: builder.query<ModelType, { modelId: string; version?: string }>({
      query: (value) => ({
        url: `/model/${value.modelId}`,
        params: {
          ...(value.version && {
            version: value.version,
          }),
        },
        method: 'GET',
      }),
      providesTags: ['Model'],
    }),
    updateModel: builder.mutation<
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
        method: 'PUT',
        data: value.payload,
      }),
      invalidatesTags: ['Model'],
    }),
    deleteModel: builder.mutation<string, string>({
      query: (value) => ({
        url: `/model/${value}`,
        method: 'DELETE',
      }),
    }),
    createRelease: builder.mutation<
      string,
      { modelId: string; version: string; status: string }
    >({
      query: (value) => ({
        url: `/model/${value.modelId}/release`,
        params: {
          status: value.status,
          version: value.version,
        },
        method: 'POST',
      }),
    }),
    getPriorVersions: builder.query<
      {
        label: { [key: string]: string };
        version: string;
        status: string;
        versionIri: string;
      }[],
      { modelId: string; version?: string }
    >({
      query: (value) => ({
        url: `/model/${value.modelId}/versions`,
        params: {
          ...(value.version && {
            version: value.version,
          }),
        },
        method: 'GET',
      }),
    }),
    updateVersionedModel: builder.mutation<
      string,
      {
        payload: VersionedModelUpdatePayload;
        modelId: string;
        version: string;
      }
    >({
      query: (value) => ({
        url: `/model/${value.modelId}/version`,
        params: {
          version: value.version,
        },
        data: value.payload,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useCreateModelMutation,
  useGetModelQuery,
  useUpdateModelMutation,
  useDeleteModelMutation,
  useCreateReleaseMutation,
  useGetPriorVersionsQuery,
  useUpdateVersionedModelMutation,
  util: { getRunningQueriesThunk },
} = modelApi;

export const {
  createModel,
  getModel,
  updateModel,
  deleteModel,
  createRelease,
  getPriorVersions,
} = modelApi.endpoints;

// Slice setup below

export type ViewListItem = {
  edit: boolean;
  create: boolean;
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
    create: false,
  },
  attributes: {
    list: false,
    info: false,
    edit: false,
    create: false,
  },
  associations: {
    list: false,
    info: false,
    edit: false,
    create: false,
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
  highlighted: [] as string[],
  view: initialView,
  hasChanges: false,
  graphHasChanges: false,
  displayGraphHasChanges: false,
  displayWarning: false,
  displayLang: 'fi',
  addResourceRestrictionToClass: false,
  updateVisualization: false,
  updateClassData: false,
  tools: {
    fullScreen: false,
    resetPosition: false,
    savePosition: false,
    showAttributes: true,
    showAssociations: true,
    showDomainRange: true,
    showAssociationRestrictions: true,
    showAttributeRestrictions: true,
    showByName: true,
    showById: false,
    showClassHighlights: false,
  },
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
  reducers: {
    setSelected(state, action) {
      return {
        ...state,
        selected: {
          id: action.payload.id,
          type: action.payload.type,
          modelId: action.payload.modelId,
          version: action.payload.version,
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
    setHighlighted(state, action) {
      return {
        ...state,
        highlighted: action.payload,
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
    setDisplayLang(state, action) {
      return {
        ...state,
        displayLang: action.payload,
      };
    },
    setAddResourceRestrictionToClass(state, action) {
      return {
        ...state,
        addResourceRestrictionToClass: action.payload,
      };
    },
    setUpdateVisualization(state, action) {
      return {
        ...state,
        updateVisualization: action.payload,
      };
    },
    setUpdateClassData(state, action) {
      return {
        ...state,
        updateClassData: action.payload,
      };
    },
    setTools(state, action) {
      if (
        action.payload.key === 'showByName' ||
        action.payload.key === 'showById'
      ) {
        return {
          ...state,
          tools: {
            ...state.tools,
            showByName: action.payload.key === 'showByName' ? true : false,
            showById: action.payload.key === 'showById' ? true : false,
          },
        };
      }

      return {
        ...state,
        tools: {
          ...state.tools,
          [action.payload.key]: action.payload.value,
        },
      };
    },
    setGraphHasChanges(state, action) {
      return {
        ...state,
        graphHasChanges: action.payload,
      };
    },
    setDisplayGraphHasChanges(state, action) {
      return {
        ...state,
        displayGraphHasChanges: action.payload,
      };
    },
  },
});

export function selectSelected() {
  return (state: AppState) => state.model.selected;
}

export function setSelected(
  id: string,
  type: keyof typeof initialView,
  modelId: string,
  version?: string
): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setSelected({ id, type, modelId, version }));
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

export function selectHighlighted() {
  return (state: AppState) => state.model.highlighted;
}

export function setHighlighted(ids: string[]): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setHighlighted(ids));
}

export function resetHighlighted(): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setHighlighted([]));
}

export function selectViews() {
  return (state: AppState) => state.model.view;
}

export function selectClassView() {
  return (state: AppState): ViewListItem => state.model.view.classes;
}

export function selectResourceView(type: 'associations' | 'attributes') {
  return (state: AppState) => state.model.view[type];
}

export function selectCurrentViewName() {
  return (state: AppState) =>
    Object.entries(state.model.view as ViewList).find((v) =>
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

export function setDisplayLang(value: string): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setDisplayLang(value));
}

export function selectDisplayLang() {
  return (state: AppState) => state.model.displayLang;
}

export function setModelTools(key: string, value: boolean): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setTools({ key, value }));
}

export function selectModelTools() {
  return (state: AppState) => state.model.tools;
}

export function setFullScreen(value: boolean): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setTools({ key: 'fullScreen', value }));
}

export function selectFullScreen() {
  return (state: AppState) => state.model.tools.fullScreen;
}

export function setSavePosition(value: boolean): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setTools({ key: 'savePosition', value }));
}

export function selectSavePosition() {
  return (state: AppState) => state.model.tools.savePosition;
}

export function setResetPosition(value: boolean): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setTools({ key: 'resetPosition', value }));
}

export function selectResetPosition() {
  return (state: AppState) => state.model.tools.resetPosition;
}

export function setAddResourceRestrictionToClass(value: boolean): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setAddResourceRestrictionToClass(value));
}

export function selectAddResourceRestrictionToClass() {
  return (state: AppState): boolean =>
    state.model.addResourceRestrictionToClass;
}

export function setUpdateVisualization(value: boolean): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setUpdateVisualization(value));
}

export function selectUpdateVisualization() {
  return (state: AppState): boolean => state.model.updateVisualization;
}

export function setUpdateClassData(value: boolean): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setUpdateClassData(value));
}

export function selectUpdateClassData() {
  return (state: AppState): boolean => state.model.updateClassData;
}

export function setGraphHasChanges(value: boolean): AppThunk {
  return (dispatch) => dispatch(modelSlice.actions.setGraphHasChanges(value));
}

export function selectGraphHasChanges() {
  return (state: AppState): boolean => state.model.graphHasChanges;
}

export function setDisplayGraphHasChanges(value: boolean): AppThunk {
  return (dispatch) =>
    dispatch(modelSlice.actions.setDisplayGraphHasChanges(value));
}

export function selectDisplayGraphHasChanges() {
  return (state: AppState): boolean => state.model.displayGraphHasChanges;
}
