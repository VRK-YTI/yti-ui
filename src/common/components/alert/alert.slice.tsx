import { createSlice, SerializedError } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { AxiosBaseQueryError } from '@app/store/axios-base-query';

export type Alert = {
  code: number | string;
  message: string;
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
    alerts: (AxiosBaseQueryError | SerializedError | undefined)[],
    previousAlerts: Alert[]
  ): AppThunk =>
  async (dispatch) => {
    const newAlerts = alerts
      .filter((alert) => {
        // AxiosBaseQueryError
        if (
          alert &&
          'status' in alert &&
          !previousAlerts.map((pAlert) => pAlert.code).includes(alert.status)
        ) {
          return true;
        }

        // SerializedError
        if (
          alert &&
          'code' in alert &&
          alert.code !== undefined &&
          !previousAlerts.map((pAlert) => pAlert.code).includes(alert.code)
        ) {
          return true;
        }

        // undefined
        return false;
      })
      .map((error) => {
        // AxiosBaseQueryError
        if (error && 'status' in error) {
          return {
            code: error.status,
            message:
              (error.data as { error?: string })?.error ??
              `Error code ${error.status}`,
            visible: true,
          };
        }

        // SerializedError
        if (error && 'code' in error) {
          return {
            code: error.code ?? 'UNKNOWN_ERROR',
            message:
              error.message ?? error.code
                ? `Error code ${error.code}`
                : 'Unknown error',
            visible: true,
          };
        }

        return {
          code: 'UNHANDLED_ERROR',
          message: 'Unhandled error',
        };
      });

    if (newAlerts.length > 0) {
      dispatch(setAlertPrivate([...previousAlerts, ...newAlerts]));
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
