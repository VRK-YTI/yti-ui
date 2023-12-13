import { createApi } from '@reduxjs/toolkit/query/react';
import { CodeType } from '@app/common/interfaces/code';
import { getCodeListApiBaseQuery } from '@app/store/api-base-query';
import {
  CodeRegistry,
  CodeRegistryType,
} from '@app/common/interfaces/code-registry';

function generateUrl({
  lang,
  searchTerm,
  codeRegistryCodeValue,
  pageFrom,
  status,
}: {
  lang: string;
  searchTerm?: string;
  codeRegistryCodeValue?: string;
  pageFrom?: number;
  status?: string;
}): string {
  const pageSize = '&pageSize=20';
  const pageStart = `&from=${pageFrom ? (pageFrom - 1) * 20 : 0}`;
  const statusValue =
    status && status !== 'all-statuses'
      ? `&status=${status.toUpperCase()}`
      : '';

  if (!searchTerm && !codeRegistryCodeValue) {
    return `/codeschemes?expand=codeRegistry,externalReference,propertyType,code,organization,extension,valueType,searchHit&searchCodes=false&searchExtensions=false&language=${lang}${pageSize}${pageStart}${statusValue}`;
  }

  const base = `/codeschemes?expand=codeRegistry,externalReference,propertyType,code,organization,extension,valueType,searchHit&searchCodes=false&searchExtensions=false&language=${lang}`;
  const term = searchTerm ? `&searchTerm=${searchTerm}` : '';
  const codeRegistry = codeRegistryCodeValue
    ? `&codeRegistryCodeValue=${codeRegistryCodeValue}`
    : '';

  return `${base}${term}${codeRegistry}${pageSize}${pageStart}${statusValue}`;
}

export const codeApi = createApi({
  reducerPath: 'codeApi',
  baseQuery: getCodeListApiBaseQuery(),
  tagTypes: ['CodeApi', 'Languages'],
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
        status?: string;
      }
    >({
      query: (props) => ({
        url: generateUrl(props),
        method: 'GET',
      }),
    }),
    getAllCodes: builder.query<CodeType[], string[]>({
      query: (uris) => ({
        url: `/coderegistries/codes?uri=${uris.join('&uri=')}`,
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
    getCodeRegistry: builder.query<
      {
        meta: {
          code: number;
          from: number;
          resultCount: number;
          totalResults: number;
        };
        results: CodeRegistryType[];
      },
      {
        codeRegistryId: string;
        codeValue: string;
      }
    >({
      query: (value) => ({
        url: `/coderegistries/${value.codeRegistryId}/codeschemes/${value.codeValue}/codes/`,
        method: 'GET',
      }),
    }),
    getLanguages: builder.query<
      {
        meta: {
          code: number;
          from: number;
          resultCount: number;
          totalResults: number;
        };
        results: {
          codeValue: string;
          prefLabel: {
            [key: string]: string;
          };
        }[];
      },
      void
    >({
      query: () => ({
        url: '/coderegistries/interoperabilityplatform/codeschemes/languagecodes/codes',
        method: 'GET',
      }),
      providesTags: ['Languages'],
    }),
  }),
});

export const {
  useGetCodesQuery,
  useGetAllCodesQuery,
  useGetCodeRegistriesQuery,
  useGetCodeRegistryQuery,
  useGetLanguagesQuery,
  util: { getRunningQueriesThunk },
} = codeApi;

export const { getCodes, getLanguages } = codeApi.endpoints;
