import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';

const initialState = {
  isSideNavigationMinimized: false,
  showFadeInAnimation: false,
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: initialState,
  reducers: {
    setIsSideNavigationMinimized(state, action) {
      return {
        ...state,
        isSideNavigationMinimized: action.payload
      };
    },
    setShowFadeInAnimation(state, action) {
      return {
        ...state,
        showFadeInAnimation: action.payload
      };
    },
  },
});

export function selectIsSideNavigationMinimized() {
  return (state: AppState) => state.navigation.isSideNavigationMinimized;
}

export function setIsSideNavigationMinimized(isMinimized?: boolean): AppThunk {
  return (dispatch) => dispatch(navigationSlice.actions.setIsSideNavigationMinimized(isMinimized ?? false));
}

export function selectShowFadeInAnimation() {
  return (state: AppState) => state.navigation.showFadeInAnimation;
}

export function setShowFadeInAnimation(showAnimation?: boolean): AppThunk {
  return (dispatch) => dispatch(navigationSlice.actions.setShowFadeInAnimation(showAnimation ?? false));
}
