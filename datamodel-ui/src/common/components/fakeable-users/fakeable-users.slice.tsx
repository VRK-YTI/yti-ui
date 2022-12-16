import { FakeableUser } from '@app/common/interfaces/fakeable-user.interface';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

export const fakeableUsersApi = createApi({
  reducerPath: 'fakeableUsers',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['fakeableUsers'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getFakeableUsers: builder.query<FakeableUser[], void>({
      query: () => ({
        url: '/fakeableUsers',
        method: 'GET',
      }),
    }),
  }),
});

export default fakeableUsersApi.reducer;

export const {
  useGetFakeableUsersQuery,
  util: { getRunningQueriesThunk },
} = fakeableUsersApi;

export const { getFakeableUsers } = fakeableUsersApi.endpoints;
