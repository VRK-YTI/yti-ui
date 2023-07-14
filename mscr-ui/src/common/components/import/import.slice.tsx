import { createApi } from '@reduxjs/toolkit/query/react';
import { ImportResponse } from '@app/common/interfaces/import.interface';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';

// Here we list the json file upload API

export const importApi = createApi({
  reducerPath: 'importApi',
  baseQuery: getDatamodelApiBaseQuery((headers) => ({
    ...headers,
    'content-type': 'multipart/form-data',
  })),
  tagTypes: ['json'],
  endpoints: (builder) => ({
    postSchemaFile: builder.mutation<
      ImportResponse,
      { pid: string; file: FormData }
    >({
      query: (props) => ({
        url: `/schema/${props.pid}/upload?contentType=application/json`,
        method: 'PUT',
        data: props.file,
      }),
    }),
    postCrosswalkFile: builder.mutation<
      ImportResponse,
      { pid: string; file: FormData }
    >({
      query: (props) => ({
        url: `/crosswalk/${props.pid}/upload?contentType=application/json`,
        method: 'PUT',
        data: props.file,
      }),
    }),
  }),
});

export const { usePostSchemaFileMutation, usePostCrosswalkFileMutation } =
  importApi;
