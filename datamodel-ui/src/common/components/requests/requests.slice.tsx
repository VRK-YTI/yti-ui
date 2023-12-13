import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Request } from 'yti-common-ui/interfaces/request.interface';

function generateUri(organizationId: string, services: string[]): string {
  let uri = `/requests?organizationId=${organizationId}`;

  services.forEach((service) => {
    if (service === 'terminologies') {
      uri = `${uri}&roles=TERMINOLOGY_EDITOR`;
    }

    if (service === 'codelists') {
      uri = `${uri}&roles=CODE_LIST_EDITOR`;
    }

    if (service === 'datamodels') {
      uri = `${uri}&roles=DATA_MODEL_EDITOR`;
    }
  });

  if (process.env.ENV_TYPE === 'development') {
    uri = `${uri}&fake.login.mail=admin@localhost`;
  }

  return uri;
}

export const requestApi = createApi({
  reducerPath: 'requestApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Request'],
  endpoints: (builder) => ({
    getRequests: builder.query<Request[], void>({
      query: () => ({
        url: '/requests',
        method: 'GET',
      }),
      providesTags: ['Request'],
    }),
    postRequest: builder.mutation<
      null,
      {
        organizationId: string;
        services: string[];
      }
    >({
      query: (values) => ({
        url: generateUri(values.organizationId, values.services),
        method: 'POST',
      }),
      invalidatesTags: ['Request'],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  usePostRequestMutation,
  util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = requestApi;

export const { getRequests } = requestApi.endpoints;

export default requestApi.reducer;
