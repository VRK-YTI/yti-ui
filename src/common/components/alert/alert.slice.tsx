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
      note: AxiosBaseQueryError | SerializedError | undefined;
      displayText: string;
    }[],
    previousAlerts: Alert[]
  ): AppThunk =>
  async (dispatch) => {
    const newAlerts = alerts
      .filter((alert) => {
        // AxiosBaseQueryError
        if (
          alert.note &&
          'status' in alert.note &&
          !previousAlerts
            .map((pAlert) => pAlert.displayText)
            .includes(alert.displayText)
        ) {
          return true;
        }

        // SerializedError
        if (
          alert.note &&
          'code' in alert.note &&
          alert.note?.code !== undefined &&
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
        if (e.note && 'status' in e.note) {
          return {
            code: e.note.status,
            message:
              (e.note.data as { error?: string })?.error ??
              `Error code ${e.note.status}`,
            visible: true,
            displayText: e.displayText,
          };
        }

        // SerializedError
        if (e.note && 'code' in e.note) {
          return {
            code: e.note.code ?? 'UNKNOWN_ERROR',
            message:
              e.note.message ?? e.note.code
                ? `Error code ${e.note.code}`
                : 'Unknown error',
            visible: true,
            displayText: e.displayText,
          };
        }

        return {
          code: 'UNHANDLED_ERROR',
          message: 'Unhandled error',
          // empty display text will be replaced later with default error message
          displayText: '',
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
