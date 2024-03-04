import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '@app/store';
import isHydrate from '@app/store/isHydrate';
import {
  Crosswalk,
  CrosswalkWithVersionInfo,
} from '@app/common/interfaces/crosswalk.interface';
import { NodeMapping } from '@app/common/interfaces/crosswalk-connection.interface';

export const crosswalkApi = createApi({
  reducerPath: 'crosswalkApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['crosswalkApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    putCrosswalk: builder.mutation<any, any>({
      query: (value) => ({
        url: '/crosswalk',
        method: 'PUT',
        data: value,
      }),
    }),
    //Register Crosswalk with file
    putCrosswalkFull: builder.mutation<any, FormData>({
      query: (file) => ({
        url: '/crosswalkFull',
        method: 'PUT',
        data: file,
        headers: {
          'content-Type': 'multipart/form-data;',
        },
      }),
    }),

    getCrosswalk: builder.query<Crosswalk, string>({
      query: (pid) => ({
        url: `/crosswalk/${pid}`,
        method: 'GET',
      }),
    }),

    getCrosswalkWithRevisions: builder.query<CrosswalkWithVersionInfo, string>({
      query: (pid) => ({
        url: `/crosswalk/${pid}?includeVersionInfo=true`,
        method: 'GET',
      }),
    }),

    getMappings: builder.query<NodeMapping[], any>({
      query: (pid) => ({
        url: `/crosswalk/${pid}/mapping`,
        method: 'GET',
      }),
    }),

    putMapping: builder.mutation<
      NodeMapping,
      {
        payload: any;
        pid: string;
      }
    >({
      query: (value) => ({
        url: `/crosswalk/${value.pid}/mapping`,
        method: 'PUT',
        data: value.payload,
      }),
    }),

    patchMapping: builder.mutation<
      NodeMapping,
      {
        payload: any;
        pid: string;
      }
    >({
      query: (value) => ({
        url: `/crosswalk/${value.pid}`,
        method: 'PUT',
        data: value.payload,
      }),
    }),

    deleteMapping: builder.mutation<string, string>({
      query: (value) => ({
        url: `/crosswalk/${value}`,
        method: 'DELETE',
      }),
    }),

    patchCrosswalk: builder.mutation<
      any,
      {
        payload: any;
        pid: string;
      }
    >({
      query: (value) => ({
        url: `/crosswalk/${value.pid}`,
        method: 'PATCH',
        data: value.payload,
      }),
    }),

    deleteCrosswalk: builder.mutation<string, string>({
      query: (value) => ({
        url: `/crosswalk/${value}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  usePutCrosswalkMutation,
  usePutCrosswalkFullMutation,
  useGetCrosswalkQuery,
  useGetCrosswalkWithRevisionsQuery,
  useGetMappingsQuery,
  usePutMappingMutation,
  usePatchMappingMutation,
  useDeleteMappingMutation,
  usePatchCrosswalkMutation,
  useDeleteCrosswalkMutation,
  util: { getRunningQueriesThunk },
} = crosswalkApi;

export const {
  putCrosswalk,
  putCrosswalkFull,
  getCrosswalk,
  getCrosswalkWithRevisions,
  patchCrosswalk,
  deleteCrosswalk,
} = crosswalkApi.endpoints;

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
  },
  hovered: {
    id: '',
    type: '',
  },
  highlighted: [],
  view: initialView,
};

export const crosswalkSlice = createSlice({
  name: 'crosswalk',
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
        ...action.payload.crosswalk,
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
  },
});

export function selectSelected() {
  // return (state: AppState) => state.schema.selected;
}

export function setSelected(
  id: string,
  type: keyof typeof initialView
): AppThunk {
  return (dispatch) =>
    dispatch(crosswalkSlice.actions.setSelected({ id, type }));
}

export function resetSelected(): AppThunk {
  return (dispatch) =>
    dispatch(crosswalkSlice.actions.setSelected({ id: '', type: '' }));
}

export function selectHovered() {
  //return (state: AppState) => state.model.hovered;
}

export function setHovered(id: string, type: keyof ViewList): AppThunk {
  return (dispatch) =>
    dispatch(crosswalkSlice.actions.setHovered({ id, type }));
}

export function resetHovered(): AppThunk {
  return (dispatch) =>
    dispatch(crosswalkSlice.actions.setHovered({ id: '', type: '' }));
}

export function selectViews() {
  //return (state: AppState) => state.model.view;
}

export function selectClassView() {
  //return (state: AppState) => state.model.view.classes;
}