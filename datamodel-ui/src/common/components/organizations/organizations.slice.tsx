import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Organization } from '@app/common/interfaces/organizations.interface';

export const organizationsApi = createApi({
  reducerPath: 'organizationsApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Organizations'],
  endpoints: (builder) => ({
    getOrganizations: builder.query<
      Organization[],
      { sortLang: string; includeChildOrganizations?: boolean }
    >({
      query: (value) => ({
        url: `/frontend/organizations?sortLang=${value.sortLang}${
          value.includeChildOrganizations
            ? '&includeChildOrganizations=true'
            : ''
        }`,
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
