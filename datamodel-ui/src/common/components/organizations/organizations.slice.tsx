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
      transformResponse: (response: Organizations) => {
        const formattedResponse = response;

        formattedResponse['@graph'] = response['@graph'].map((g) => ({
          ...g,
          prefLabel: Array.isArray(g.prefLabel) ? g.prefLabel : [g.prefLabel],
        }));

        return formattedResponse;
      },
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  util: { getRunningQueriesThunk },
} = organizationsApi;

export const { getOrganizations } = organizationsApi.endpoints;
