import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { AppState, AppThunk } from "../../../store";
import { User } from "../../interfaces/user-interface";

export const initialState: User = {
  anonymous: true,
  email: "",
  firstName: "",
  lastName: "",
  id: "",
  superuser: false,
  newlyCreated: false,
  rolesInOrganizations: {},
  organizationsInRole: {},
  enabled: true,
  accountNonExpired: true,
  accountNonLocked: true,
  credentialsNonExpired: true,
  username: "",
  authorities: [],
  hasToken: false,
  tokenRole: "",
  containerUri: "",
};

export const loginSlice = createSlice({
  name: "login",
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

export const setLogin =
  (userData: User): AppThunk =>
  (dispatch) => {
    dispatch(loginSlice.actions.setLogin(userData));
  };

export const selectLogin =
  () =>
  (state: AppState): User =>
    state.login;

export default loginSlice.reducer;
