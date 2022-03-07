import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '../../../store';
import { Error } from '../../interfaces/error.interface';

export interface AlertState {
  alerts: Error[];
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
        ...action.payload
      };
    },
  },
});


export const setAlert = (alerts: AlertState['alerts']): AppThunk => dispatch => {
  dispatch(
    alertSlice.actions.setAlert({
      alerts: alerts.filter(alert => alert && alert.data)
    }),
  );
};

export const selectAlert = () => (state: AppState): AlertState['alerts'] => state.alert.alerts;

export default alertSlice.reducer;
