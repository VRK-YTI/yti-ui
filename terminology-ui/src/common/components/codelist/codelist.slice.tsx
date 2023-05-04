import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getCodeListApiBaseQuery } from '@app/store/api-base-query';

export interface CodeListSearchParams {
  registry: string;
  codeScheme: string;
  code?: string;
}

export interface CodeListResponse {
  results: {
    prefLabel: { [key: string]: string };
    codeValue: string;
  }[];
}

export const codeListApi = createApi({
  reducerPath: 'codeListApi',
  baseQuery: getCodeListApiBaseQuery(),
  tagTypes: ['codeList'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getCode: builder.query<CodeListResponse, CodeListSearchParams>({
      query: (params) => ({
        url: `/coderegistries/${params.registry}/codeschemes/${params.codeScheme}/codes/${params.code}`,
        method: 'GET',
      }),
    }),
    getCodes: builder.query<CodeListResponse, CodeListSearchParams>({
      query: (params) => ({
        url: `/coderegistries/${params.registry}/codeschemes/${params.codeScheme}/codes`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetCodeQuery,
  useGetCodesQuery,
  util: { getRunningQueriesThunk },
} = codeListApi;

export const { getCode, getCodes } = codeListApi.endpoints;
