import { createSlice, SerializedError } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { AxiosBaseQueryError } from '@app/store/axios-base-query';

export type Alert = {
  code: number | string;
  message: string;
  visible?: boolean;
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
      error: AxiosBaseQueryError | SerializedError | undefined;
      displayText: string;
    }[],
    previousAlerts: Alert[]
  ): AppThunk =>
  async (dispatch) => {
    const newAlerts = alerts
      .filter((alert) => {
        // AxiosBaseQueryError
        if (
          alert.error &&
          'status' in alert.error &&
          !previousAlerts
            .map((pAlert) => pAlert.displayText)
            .includes(alert.displayText)
        ) {
          return true;
        }

        // SerializedError
        if (
          alert.error &&
          'code' in alert.error &&
          alert.error?.code !== undefined &&
          !previousAlerts
            .map((pAlert) => pAlert.displayText)
            .includes(alert.displayText)
        ) {
          return true;
        }

        // undefined
        return false;
      })
      .map((e) => {
        // AxiosBaseQueryError
        if (e.error && 'status' in e.error) {
          return {
            code: e.error.status,
            message:
              (e.error.data as { error?: string })?.error ??
              `Error code ${e.error.status}`,
            visible: true,
            displayText: e.displayText,
          };
        }

        // SerializedError
        if (e.error && 'code' in e.error) {
          return {
            code: e.error.code ?? 'UNKNOWN_ERROR',
            message:
              e.error.message ?? e.error.code
                ? `Error code ${e.error.code}`
                : 'Unknown error',
            visible: true,
            displayText: e.displayText,
          };
        }

        return {
          code: 'UNHANDLED_ERROR',
          message: 'Unhandled error',
          displayText: '_unhandled-error',
        };
      });

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
          code: alert.code,
          message: alert.message,
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
