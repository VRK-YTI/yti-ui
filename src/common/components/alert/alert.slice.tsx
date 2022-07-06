import { createSlice, SerializedError } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { Error } from '@app/common/interfaces/error.interface';

export type Alert = {
  error: Error;
  visible: boolean;
  displayText: string;
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
    alerts: {
      error: Error | SerializedError | undefined;
      displayText: string;
    }[],
    previousAlerts: Alert[]
  ): AppThunk =>
  async (dispatch) => {
    const newAlerts = alerts
      .filter(
        (alert) =>
          alert.error &&
          !previousAlerts.map((a) => a.displayText).includes(alert.displayText)
      )
      .map((alert) => ({
        error: alert.error as Error,
        visible: true,
        displayText: alert.displayText,
      }));

    if (newAlerts.length > 0) {
      dispatch(setAlertPrivate([...previousAlerts, ...newAlerts]));
    }
  };

export const setAlertVisibility =
  (alerts: Alert[], displayText?: string): AppThunk =>
  async (dispatch) => {
    const updatedAlerts = alerts.map((alert) => {
      if (alert.displayText === displayText) {
        return {
          error: alert.error,
          displayText: alert.displayText,
          visible: false,
        };
      }
      return alert;
    });

    dispatch(setAlertPrivate(updatedAlerts));
  };

export function selectAlert() {
  return (state: AppState): Alert[] => state.alert.alerts;
}

export default alertSlice.reducer;
