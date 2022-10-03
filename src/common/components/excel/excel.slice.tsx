import { createApi } from '@reduxjs/toolkit/query/react';
import { getTerminologyApiBaseQuery } from '@app/store/api-base-query';
import {
  ImportResponse,
  ImportStatus,
} from '@app/common/interfaces/excel.interface';

export const excelApi = createApi({
  reducerPath: 'excelApi',
  baseQuery: getTerminologyApiBaseQuery((headers) => ({
    ...headers,
    'content-type': 'multipart/form-data',
  })),
  tagTypes: ['excel'],
  endpoints: (builder) => ({
    postImportExcel: builder.mutation<ImportResponse, FormData>({
      query: (file) => ({
        url: '/import/excel',
        method: 'POST',
        data: file,
      }),
    }),
    getImportStatus: builder.mutation<ImportStatus, string>({
      query: (token) => ({
        url: `/import/status/${token}`,
        method: 'GET',
      }),
    }),
    postSimpleImportExcel: builder.mutation<
      ImportResponse,
      { terminologyId: string; file: FormData }
    >({
      query: (props) => ({
        url: `/import/simpleExcel/${props.terminologyId}`,
        method: 'POST',
        data: props.file,
      }),
    }),
    postImportNTRF: builder.mutation<any, any>({
      query: (props) => ({
        url: `/import/ntrf/${props.terminologyId}`,
        method: 'POST',
        data: props.file,
      }),
    }),
  }),
});

export const {
  usePostImportExcelMutation,
  useGetImportStatusMutation,
  usePostSimpleImportExcelMutation,
  usePostImportNTRFMutation,
} = excelApi;
