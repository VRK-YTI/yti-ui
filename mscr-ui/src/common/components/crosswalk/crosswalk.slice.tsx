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
  tagTypes: ['Crosswalk', 'Mappings'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    putCrosswalk: builder.mutation<Crosswalk, Partial<Metadata>>({
      query: (value) => ({
        url: '/crosswalk',
        method: 'PUT',
        data: value,
      }),
    }),
    //Register Crosswalk with file
    putCrosswalkFull: builder.mutation<Crosswalk, FormData>({
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
      providesTags: ['Crosswalk'],
    }),

    getMappings: builder.query<NodeMapping[], any>({
      query: (pid) => ({
        url: `/crosswalk/${pid}/mapping`,
        method: 'GET',
      }),
      providesTags: ['Mappings'],
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
      invalidatesTags: ['Mappings'],
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
      invalidatesTags: ['Mappings'],
    }),

    deleteMapping: builder.mutation<string, string>({
      query: (value) => ({
        url: `/crosswalk/${value}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Mappings'],
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
      invalidatesTags: ['Crosswalk'],
    }),

    deleteCrosswalk: builder.mutation<string, string>({
      query: (value) => ({
        url: `/crosswalk/${value}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Crosswalk'],
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
