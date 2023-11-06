import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';

interface AdminControlsState {
  isAdminControlsDisabled: boolean;
}

export const initialState: AdminControlsState = {
  isAdminControlsDisabled: false,
};

export const adminControlsSlice = createSlice({
  name: 'adminControls',
  initialState: initialState,
  reducers: {
    setAdminControls(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export function setAdminControls(value: boolean): AppThunk {
  return (dispatch) =>
    dispatch(
      adminControlsSlice.actions.setAdminControls({
        isAdminControlsDisabled: value,
      })
    );
}

export function selectAdminControls() {
  return (state: AppState): boolean =>
    state.adminControls.isAdminControlsDisabled;
}

export default adminControlsSlice.reducer;
