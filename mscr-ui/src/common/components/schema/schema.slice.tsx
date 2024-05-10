import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
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
    putSchemaRevision: builder.mutation<Schema, { pid: string; data: FormData }>({
      query: ({pid, data }) => ({
        url: `/schemaFull?action=revisionOf&target=${pid}`,
        method: 'PUT',
        data: data,
        headers: {
          'content-Type': 'multipart/form-data;',
        },
      })
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
  usePutSchemaRevisionMutation,
  usePatchSchemaMutation,
  util: { getRunningQueriesThunk },
} = schemaApi;

export const { putSchema, getSchema, deleteSchema, getSchemas, putSchemaFull, putSchemaRevision } =
  schemaApi.endpoints;


