import { FakeableUser } from '@app/common/interfaces/fakeable-user.interface';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import { createApi } from '@reduxjs/toolkit/query/react';

export const fakeableUsersApi = createApi({
  reducerPath: 'fakeableUsers',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['FakeableUsers'],
  endpoints: (builder) => ({
    getFakeableUsers: builder.query<FakeableUser[], void>({
      query: () => ({
        url: '/fakeable-users',
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
