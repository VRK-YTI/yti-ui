import { HYDRATE } from 'next-redux-wrapper';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { Organizations } from '@app/common/interfaces/organizations.interface';

export const organizationsApi = createApi({
  reducerPath: 'organizationsApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['organizations'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getOrganizations: builder.query<Organizations, void>({
      query: () => ({
        url: '/organizations',
        method: 'GET',
      }),
    }),
  }),
});

export const { getOrganizations } =
organizationsApi.endpoints;

export const {
  useGetOrganizationsQuery
} = organizationsApi;
