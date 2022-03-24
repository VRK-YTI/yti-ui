import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { AppState, AppThunk } from '@app/store';
import { User } from '@app/common/interfaces/user.interface';

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
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.login,
      };
    },
  },
});

export function setLogin(userData: User): AppThunk {
  return (dispatch) => dispatch(loginSlice.actions.setLogin(userData));
}

export function selectLogin() {
  return (state: AppState): User => state.login;
}

export default loginSlice.reducer;
