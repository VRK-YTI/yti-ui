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
import { Metadata } from '@app/common/interfaces/metadata.interface';

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

    putCrosswalkRevision: builder.mutation<Crosswalk, { pid: string; data: Partial<Metadata> }>({
      query: ({pid, data }) => ({
        url: `/crosswalk?action=revisionOf&target=${pid}`,
        method: 'PUT',
        data: data,
      })
    }),
    putCrosswalkFullRevision: builder.mutation<Crosswalk, { pid: string; data: FormData }>({
      query: ({pid, data }) => ({
        url: `/crosswalkFull?action=revisionOf&target=${pid}`,
        method: 'PUT',
        data: data,
        headers: {
          'content-Type': 'multipart/form-data;',
        },
      })
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
  usePutCrosswalkRevisionMutation,
  usePutCrosswalkFullRevisionMutation,
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
  putCrosswalkRevision,
  putCrosswalkFullRevision,
  getCrosswalk,
  getCrosswalkWithRevisions,
  patchCrosswalk,
  deleteCrosswalk,
} = crosswalkApi.endpoints;
