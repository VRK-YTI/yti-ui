import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState, AppThunk } from '@app/store';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { createApi } from '@reduxjs/toolkit/query/react';
import { getDatamodelApiBaseQuery } from '@app/store/api-base-query';
import isHydrate from '@app/store/isHydrate';
import { MscrUser } from '@app/common/interfaces/mscr-user.interface';

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
  extraReducers: (builder) => {
    builder.addMatcher(isHydrate, (state, action) => {
      return {
        ...state,
        ...action.payload.login,
      };
    });
  },
});

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: getDatamodelApiBaseQuery(),
  tagTypes: ['login'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  endpoints: (builder) => ({
    getAuthenticatedUser: builder.query<MscrUser, void>({
      query: () => ({
        url: '/user',
        method: 'GET',
      }),
    }),
    getAuthenticatedUserMut: builder.mutation<MscrUser, void>({
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
