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
        url: '/schema/urn:IAMNOTAPID:f8408012-9999-449c-84f1-29ef7b8053ee/upload?contentType=application/json',
        method: 'PUT',
        data: file,
      }),
    }),
    /*
    postImportJson: builder.mutation<ImportResponse, FormData>({
      query: (file) => ({
        url: '/schema',
        method: 'PUT',
        data: {
          format: 'JSONSCHEMA',
          status: 'INCOMPLETE',
          label: {
            en: 'string',
          },
          description: {
            en: 'string',
          },
          languages: ['en'],
          organizations: ['7d3a3c00-5a6b-489b-a3ed-63bb58c26a63'],
        },
      }),
    }),*/
  }),
});

export const { usePostImportJsonMutation } = importApi;
