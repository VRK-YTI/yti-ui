import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
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
  extraReducers: {
    [HYDRATE]: (state, action) => {
      // console.log('HYDRATE');
      // console.log('state', state);
      // console.log('action.payload', action.payload);
      return {
        ...state,
        ...action.payload.alert
      };
    }
  }
});


export const setAlert = (alerts: AlertState['alerts']): AppThunk => dispatch => {
  dispatch(
    alertSlice.actions.setAlert({
      alerts: alerts.filter(alert => alert)
    }),
  );
};

export const selectAlert = () => (state: AppState): AlertState['alerts'] => state.alert.alerts;

export default alertSlice.reducer;
