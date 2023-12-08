import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Organization } from '@app/common/interfaces/organizations.interface';

export const organizationsApi = createApi({
  reducerPath: 'organizationsApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Organizations'],
  endpoints: (builder) => ({
    getOrganizations: builder.query<Organization[], string>({
      query: (value) => ({
        url: `/frontend/organizations?sortLang=${value}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  util: { getRunningQueriesThunk },
} = organizationsApi;

export const { getOrganizations } = organizationsApi.endpoints;
