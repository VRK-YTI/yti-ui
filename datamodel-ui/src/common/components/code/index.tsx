import { HYDRATE } from 'next-redux-wrapper';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CodeType } from '@app/common/interfaces/code';

function generateUrl({
  searchTerm,
  infoDomain,
  pageFrom,
}: {
  searchTerm?: string;
  infoDomain?: string;
  pageFrom?: number;
}): string {
  const pageSize = '&pageSize=20';
  const pageStart = `&from=${pageFrom ? (pageFrom - 1) * 20 : 0}`;

  if (!searchTerm && !infoDomain) {
    return `/v1/codeschemes?expand=codeRegistry,externalReference,propertyType,code,organization,extension,valueType,searchHit&searchCodes=false&searchExtensions=false&language=fi${pageSize}${pageStart}`;
  }

  const base =
    '/v1/codeschemes?expand=codeRegistry,externalReference,propertyType,code,organization,extension,valueType,searchHit&searchCodes=false&searchExtensions=false&language=fi';
  const term = searchTerm ? `&searchTerm=${searchTerm}` : '';
  const domain = infoDomain ? `&infoDomain=${infoDomain}` : '';

  return `${base}${term}${domain}${pageSize}${pageStart}`;
}

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
        pageFrom?: number;
      }
    >({
      query: (props) => ({
        url: generateUrl(props),
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCodesQuery } = codeApi;

export const { getCodes } = codeApi.endpoints;
