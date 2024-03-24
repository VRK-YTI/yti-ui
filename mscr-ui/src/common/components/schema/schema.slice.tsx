import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '@app/store';
import isHydrate from '@app/store/isHydrate';
import {
  Schema, SchemaWithContent,
  SchemaWithVersionInfo
} from '@app/common/interfaces/schema.interface';
import { MscrSearchResults } from '@app/common/interfaces/search.interface';
import { Format } from '@app/common/interfaces/format.interface';
import { Metadata } from '@app/common/interfaces/metadata.interface';

function createUrl(formatRestrictions: Array<Format>) {
  const formatString = formatRestrictions.reduce((filterString, fr) => {
    return `${filterString}&format=${fr}`;
  }, '');
  return `/frontend/mscrSearch?type=SCHEMA${formatString}&pageSize=100`;
}

export const schemaApi = createApi({
  reducerPath: 'schemaApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['schemaApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    putSchema: builder.mutation<any, any>({
      query: (value) => ({
        url: '/schema',
        method: 'PUT',
        data: value,
        headers: {
          'content-Type': 'application/json;',
        },
      }),
    }),
    putSchemaFull: builder.mutation<any, FormData>({
      query: (file) => ({
        url: '/schemaFull',
        method: 'PUT',
        data: file,
        headers: {
          'content-Type': 'multipart/form-data;',
        },
      }),
    }),
    patchSchema: builder.mutation<
      Metadata,
      {
        payload: Partial<Metadata>;
        pid: string;
      }
    >({
      query: (value) => ({
        url: `/schema/${value.pid}`,
        method: 'PATCH',
        data: value.payload,
      })
    }),
    getSchema: builder.query<Schema, string>({
      query: (pid) => ({
        url: `/schema/${pid}`,
        method: 'GET',
      }),
    }),
    getSchemaWithRevisions: builder.query<SchemaWithVersionInfo, string>({
      query: (pid: string) => ({
        url: `/schema/${pid}?includeVersionInfo=true`,
        method: 'GET',
      }),
    }),
    // TODO: What is the return type?
    getSchemaOriginal: builder.query<undefined, string>({
      query: (pid) => ({
        url: `/schema/${pid}/original`,
        method: 'GET',
      }),
    }),
    getPublicSchemas: builder.query<MscrSearchResults, Array<Format>>({
      query: (formatRestrictions) => ({
        url: createUrl(formatRestrictions),
        method: 'GET',
      }),
    }),
    getFrontendSchema: builder.query<SchemaWithContent, string>({
      query: (pid) => ({
        url: `/frontend/schema/${pid}`,
        method: 'GET',
      }),
    }),
    postSchema: builder.mutation<
      string,
      {
        // Need to check How it works with our api
        payload: Schema;
        prefix: string;
      }
    >({
      query: (value) => ({
        url: `/schema/${value.prefix}`,
        method: 'POST',
        data: value.payload,
      }),
    }),
    deleteSchema: builder.mutation<string, string>({
      query: (value) => ({
        url: `/schema/${value}`,
        method: 'DELETE',
      }),
    }),
    getSchemas: builder.query<Schema[], string>({
      query: (value) => ({
        url: '/schemas',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  usePutSchemaMutation,
  useGetPublicSchemasQuery,
  useGetFrontendSchemaQuery,
  useGetSchemaQuery,
  useGetSchemaWithRevisionsQuery,
  useGetSchemaOriginalQuery,
  usePostSchemaMutation,
  useDeleteSchemaMutation,
  useGetSchemasQuery,
  usePutSchemaFullMutation,
  usePatchSchemaMutation,
  util: { getRunningQueriesThunk },
} = schemaApi;

export const { putSchema, getSchema, deleteSchema, getSchemas, putSchemaFull } =
  schemaApi.endpoints;

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

export const schemaSlice = createSlice({
  name: 'schema',
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
        ...action.payload.schema,
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
  return (dispatch) => dispatch(schemaSlice.actions.setSelected({ id, type }));
}

export function resetSelected(): AppThunk {
  return (dispatch) =>
    dispatch(schemaSlice.actions.setSelected({ id: '', type: '' }));
}

export function selectHovered() {
  //return (state: AppState) => state.model.hovered;
}

export function setHovered(id: string, type: keyof ViewList): AppThunk {
  return (dispatch) => dispatch(schemaSlice.actions.setHovered({ id, type }));
}

export function resetHovered(): AppThunk {
  return (dispatch) =>
    dispatch(schemaSlice.actions.setHovered({ id: '', type: '' }));
}

export function selectViews() {
  //return (state: AppState) => state.model.view;
}

export function selectClassView() {
  //return (state: AppState) => state.model.view.classes;
}

export function selectCurrentViewName() {
  /* return (state: AppState) =>
    Object.entries(state.model.view).find((v) =>
      typeof v[1] === 'object'
        ? Object.entries(v[1]).filter(
            (val) => Object.values(val).filter((c) => c === true).length > 0
          ).length > 0
        : v[1] === true
    )?.[0] ?? 'search';*/
}

export function setView(
  key: keyof ViewList,
  subkey?: keyof ViewListItem
): AppThunk {
  return (dispatch) => dispatch(schemaSlice.actions.setView({ key, subkey }));
}
