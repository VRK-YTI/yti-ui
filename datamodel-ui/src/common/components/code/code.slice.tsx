import { HYDRATE } from 'next-redux-wrapper';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CodeInformationDomainType } from '@app/common/interfaces/code-information-domain';
import { CodeType } from '@app/common/interfaces/code';

function generateUrl({
  searchTerm,
  infoDomain,
}: {
  searchTerm?: string;
  infoDomain?: string;
}): string {
  if (!searchTerm && !infoDomain) {
    return '/codeschemes?expand=codeRegistry,externalReference,propertyType,code,organization,extension,valueType,searchHit&searchCodes=false&searchExtensions=false&language=fi';
  }

  const base =
    '/codeschemes?expand=codeRegistry,externalReference,propertyType,code,organization,extension,valueType,searchHit&searchCodes=false&searchExtensions=false&language=fi';
  const term = searchTerm ? `&searchTerm=${searchTerm}` : '';
  const domain = infoDomain ? `&infoDomain=${infoDomain}` : '';

  return `${base}${term}${domain}`;
}

export const codeIntake = createApi({
  reducerPath: 'codeIntakeApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/codelist-intake' }),
  tagTypes: ['codeIntakeApi'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getInfoDomains: builder.query<
      {
        meta: {
          code: number;
          resultCouts: number;
        };
        results: CodeInformationDomainType[];
      },
      { lang: string }
    >({
      query: (props) => ({
        url: `/infodomains/?language=${props.lang}`,
        method: 'GET',
      }),
      transformResponse: (response: {
        meta: {
          code: number;
          resultCouts: number;
        };
        results: CodeInformationDomainType[];
      }) => {
        return {
          ...response,
          results: response.results.reverse(),
        };
      },
    }),
  }),
});

export const codeApi = createApi({
  reducerPath: 'codeApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/codelist-api' }),
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
        searchTerm?: string;
        infoDomain?: string;
      }
    >({
      query: (props) => ({
        url: generateUrl(props),
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetInfoDomainsQuery } = codeIntake;
export const { useGetCodesQuery } = codeApi;

export const { getInfoDomains } = codeIntake.endpoints;
export const { getCodes } = codeApi.endpoints;
