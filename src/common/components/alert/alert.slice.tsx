import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { Error } from '@app/common/interfaces/error.interface';

export type Alert = Error;

export interface AlertState {
  alerts: Alert[];
}

export const alertInitialState: AlertState = {
  alerts: [],
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState: alertInitialState,
  reducers: {
    setAlert(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export function setAlert(alerts: Alert[]): AppThunk {
  return (dispatch) => {
    dispatch(
      alertSlice.actions.setAlert({
        alerts: alerts.filter((alert) => alert && alert.data),
      })
    );
  };
}

export function selectAlert() {
  return (state: AppState): Alert[] => state.alert.alerts;
}

export default alertSlice.reducer;
