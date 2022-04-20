import { createSlice, SerializedError } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { Error } from '@app/common/interfaces/error.interface';

export type Alert = {
  error: Error;
  visible?: boolean;
};

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

function setAlertPrivate(alerts: Alert[]): AppThunk {
  return (dispatch) => {
    dispatch(
      alertSlice.actions.setAlert({
        alerts: alerts,
      })
    );
  };
}

export const setAlert =
  (
    alerts: (Error | SerializedError | undefined)[],
    previousAlerts: Alert[]
  ): AppThunk =>
  async (dispatch) => {
    const newAlerts = alerts.filter(
      (alert) =>
        alert &&
        'data' in alert &&
        !previousAlerts.map((pAlert) => pAlert.error).includes(alert)
    ) as Error[];

    if (newAlerts.length > 0) {
      dispatch(
        setAlertPrivate([
          ...previousAlerts,
          ...newAlerts.map((nAlert) => ({
            error: nAlert,
            visible: true,
          })),
        ])
      );
    }
  };

export const setAlertVisibility =
  (alerts: Alert[]): AppThunk =>
  async (dispatch) => {
    dispatch(setAlertPrivate(alerts));
  };

export function selectAlert() {
  return (state: AppState): Alert[] => state.alert.alerts;
}

export default alertSlice.reducer;
