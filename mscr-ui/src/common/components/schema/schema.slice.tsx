import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import {
  Schema,
  SchemaWithContent,
  SchemaWithVersionInfo,
} from '@app/common/interfaces/schema.interface';
import { MscrSearchResults } from '@app/common/interfaces/search.interface';
import { Format } from '@app/common/interfaces/format.interface';
import { Metadata } from '@app/common/interfaces/metadata.interface';
import { DataTypeResults } from '@app/common/interfaces/data-type.interface';

function createSearchUrl(formatRestrictions: Array<Format>) {
  const formatString = formatRestrictions.reduce((filterString, fr) => {
    return `${filterString}&format=${fr}`;
  }, '');
  return `/frontend/mscrSearch?type=SCHEMA${formatString}&pageSize=100`;
}

function createDataTypeUrl({schemaId, target, dataType}: {schemaId: string; target: string; dataType: string}) {
  const encodedTarget = encodeURIComponent(target);
  const encodedDataType = encodeURIComponent(dataType);
  return `/dtr/schema/${schemaId}/properties?target=${encodedTarget}&datatype=${encodedDataType}`;
}

export const schemaApi = createApi({
  reducerPath: 'schemaApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Schema', 'FrontendSchema'],
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
    putSchemaMscrCopy: builder.mutation<Schema, { pid: string; data: Partial<Metadata> }>({
      query: ({pid, data }) => ({
        url: `/schema?action=mscrCopyOf&target=${pid}`,
        method: 'PUT',
        data: data,
        headers: {
          'content-Type': 'application/json;',
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
      }),
      invalidatesTags: ['Schema', 'FrontendSchema'],
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
      providesTags: ['Schema'],
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
        url: createSearchUrl(formatRestrictions),
        method: 'GET',
      }),
    }),
    getFrontendSchema: builder.query<SchemaWithContent, string>({
      query: (pid) => ({
        url: `/frontend/schema/${pid}`,
        method: 'GET',
      }),
      providesTags: ['FrontendSchema'],
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
    getTypesSearchResults: builder.query<DataTypeResults, { query: string; page: number; pageSize: number }>({
      query: ({ query, page, pageSize }) => ({
        url: `/dtr/searchBasicInfoTypes?query=${query}&page=${page}&pageSize=${pageSize}`,
        method: 'GET',
      }),
    }),
    patchDataType: builder.mutation<Schema, {schemaId: string; target: string; dataType: string }>({
      query: ({schemaId, target, dataType}) => ({
        url: createDataTypeUrl({schemaId, target, dataType}),
        method: 'PATCH',
      }),
      invalidatesTags: ['FrontendSchema'],
    }),
    deleteSchema: builder.mutation<string, string>({
      query: (value) => ({
        url: `/schema/${value}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schema', 'FrontendSchema'],
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
  usePutSchemaMscrCopyMutation,
  usePatchSchemaMutation,
  useGetTypesSearchResultsQuery,
  usePatchDataTypeMutation,
  util: { getRunningQueriesThunk },
} = schemaApi;

export const { putSchema, getSchema, deleteSchema, getSchemas, putSchemaFull, putSchemaRevision } =
  schemaApi.endpoints;
