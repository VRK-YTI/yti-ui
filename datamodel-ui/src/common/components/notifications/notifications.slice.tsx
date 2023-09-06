import {
  NotificationKeys,
  NotificationType,
} from '@app/common/interfaces/notifications.interface';
import { AppState, AppThunk } from '@app/store';
import { createSlice } from '@reduxjs/toolkit';

const initialNotifications: NotificationType = {
  success: {},
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: initialNotifications,
  reducers: {
    setNotification(state, action) {
      return {
        ...state,
        success: {
          ...action.payload,
        },
      };
    },
    clearNotifications(state) {
      return {
        ...state,
        success: {},
      };
    },
  },
});

export function selectNotification() {
  return (state: AppState) => {
    if (Object.keys(state.notifications.success).length < 1) {
      return state.notifications.success;
    }

    const notification = Object.entries(state.notifications.success).filter(
      (value) => value[1]
    )?.[0];

    return notification ? Object.fromEntries([notification]) : {};
  };
}

export function setNotification(key: NotificationKeys): AppThunk {
  return (dispatch) =>
    dispatch(notificationsSlice.actions.setNotification({ [key]: true }));
}

export function clearNotification(): AppThunk {
  return (dispatch) =>
    dispatch(notificationsSlice.actions.clearNotifications());
}
