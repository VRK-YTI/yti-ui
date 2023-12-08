import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';

export const initialState: User = {
  anonymous: true,
  email: '',
  firstName: '',
  lastName: '',
  id: '',
  superuser: false,
  newlyCreated: false,
  rolesInOrganizations: {},
  organizationsInRole: {},
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  username: '',
  authorities: [],
  hasToken: false,
  tokenRole: '',
  containerUri: '',
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLogin(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['Login'],
  endpoints: (builder) => ({
    getAuthenticatedUser: builder.query<User, void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
    }),
    getAuthenticatedUserMut: builder.mutation<User, void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
    }),
  }),
});

export function setLogin(userData: User): AppThunk {
  return (dispatch) => dispatch(loginSlice.actions.setLogin(userData));
}

export function selectLogin() {
  return (state: AppState): User => state.login;
}

export default loginSlice.reducer;

export const { getAuthenticatedUser, getAuthenticatedUserMut } =
  loginApi.endpoints;

export const {
  useGetAuthenticatedUserQuery,
  useGetAuthenticatedUserMutMutation,
  util: { getRunningQueriesThunk },
} = loginApi;
