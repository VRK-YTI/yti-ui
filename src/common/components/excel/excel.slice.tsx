import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '@app/common/components/axios-base-query';
import {
  ImportResponse,
  ImportStatus,
} from '@app/common/interfaces/excel.interface';

export const excelApi = createApi({
  reducerPath: 'excelApi',
  baseQuery: axiosBaseQuery(
    { baseUrl: '/terminology-api/api/v1' },
    { headers: { 'content-type': 'multipart/form-data' } }
  ),
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
  }),
});

export const { usePostImportExcelMutation, useGetImportStatusMutation } =
  excelApi;
