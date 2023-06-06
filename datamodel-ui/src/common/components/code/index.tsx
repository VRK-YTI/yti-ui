import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { CodeType } from '@app/common/interfaces/code';
import { getCodeListApiBaseQuery } from '@app/store/api-base-query';
import { CodeRegistry } from '@app/common/interfaces/code-registry';

function generateUrl({
  lang,
  searchTerm,
  codeRegistryCodeValue,
  pageFrom,
}: {
  lang: string;
  searchTerm?: string;
  codeRegistryCodeValue?: string;
  pageFrom?: number;
}): string {
  const pageSize = '&pageSize=20';
  const pageStart = `&from=${pageFrom ? (pageFrom - 1) * 20 : 0}`;

  if (!searchTerm && !codeRegistryCodeValue) {
    return `/codeschemes?expand=codeRegistry,externalReference,propertyType,code,organization,extension,valueType,searchHit&searchCodes=false&searchExtensions=false&language=${lang}${pageSize}${pageStart}`;
  }

  const base = `/codeschemes?expand=codeRegistry,externalReference,propertyType,code,organization,extension,valueType,searchHit&searchCodes=false&searchExtensions=false&language=${lang}`;
  const term = searchTerm ? `&searchTerm=${searchTerm}` : '';
  const codeRegistry = codeRegistryCodeValue
    ? `&codeRegistryCodeValue=${codeRegistryCodeValue}`
    : '';

  return `${base}${term}${codeRegistry}${pageSize}${pageStart}`;
}

export const codeApi = createApi({
  reducerPath: 'codeApi',
  baseQuery: getCodeListApiBaseQuery(),
  tagTypes: ['codeApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getCodes: builder.query<
      {
        meta: {
          from: number;
          resultCount: number;
          totalResults: number;
        };
        results: CodeType[];
      },
      {
        lang: string;
        searchTerm?: string;
        codeRegistryCodeValue?: string;
        pageFrom?: number;
      }
    >({
      query: (props) => ({
        url: generateUrl(props),
        method: 'GET',
      }),
    }),
    getCodeRegistries: builder.query<
      {
        meta: {
          code: number;
          from: number;
          resultCount: number;
          totalResults: number;
        };
        results: CodeRegistry[];
      },
      void
    >({
      query: () => ({
        url: '/coderegistries',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCodesQuery, useGetCodeRegistriesQuery } = codeApi;

export const { getCodes } = codeApi.endpoints;
