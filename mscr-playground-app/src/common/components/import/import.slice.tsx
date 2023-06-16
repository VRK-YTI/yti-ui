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
    postImportJson: builder.mutation<ImportResponse, FormData>({
      query: (file) => ({
        url: '/schema/34567/upload',
        method: 'PUT',
        data: file,
      }),
    }),
    postSchema: builder.mutation<ImportResponse, FormData>({
      query: (props) => ({
        url: '/schema',
        method: 'PUT',
      }),
    }),
  }),
});

export const { usePostImportJsonMutation, usePostSchemaMutation } = importApi;
