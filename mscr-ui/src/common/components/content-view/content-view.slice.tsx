import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';

export enum Tab {
  Metadata = 0,
  Editor,
  History,
}

const initialState = {
  selectedTab: Tab.Metadata,
  isEditContentActive: false,
  isEditMetadataActive: false,
};

export const contentViewSlice = createSlice({
  name: 'contentView',
  initialState: initialState,
  reducers: {
    setSelectedTab(state, action) {
      if (action.payload.tab === Tab.Editor) {
        return {
          ...state,
          selectedTab: Tab.Editor,
          isEditMetadataActive: false,
        };
      }
      if (action.payload.tab === Tab.Metadata) {
        return {
          ...state,
          selectedTab: Tab.Metadata,
          isEditContentActive: false,
        };
      }
      return {
        ...state,
        selectedTab: action.payload.tab,
        isEditContentActive: false,
        isEditMetadataActive: false,
      };
    },
    setEditContentActive(state, action) {
      if (action.payload === false) {
        return {
          ...state,
          isEditContentActive: false,
        };
      }
      return {
        ...state,
        selectedTab: Tab.Editor,
        isEditContentActive: true,
      };
    },
    setEditMetadataActive(state, action) {
      if (action.payload === false) {
        return {
          ...state,
          isEditMetadataActive: false,
        };
      }
      return {
        ...state,
        selectedTab: Tab.Metadata,
        isEditMetadataActive: true,
      };
    },
  },
});

export function selectSelectedTab() {
  return (state: AppState) => state.contentView.selectedTab;
}

export function setSelectedTab(tab: number): AppThunk {
  return (dispatch) => dispatch(contentViewSlice.actions.setSelectedTab({ tab }));
}

export function selectIsEditContentActive() {
  return (state: AppState) => state.contentView.isEditContentActive;
}

export function setIsEditContentActive(isActive?: boolean): AppThunk {
  return (dispatch) =>
    dispatch(contentViewSlice.actions.setEditContentActive(isActive ?? false));
}

export function selectIsEditMetadataActive() {
  return (state: AppState) => state.contentView.isEditMetadataActive;
}

export function setIsEditMetadataActive(isActive?: boolean): AppThunk {
  return (dispatch) =>
    dispatch(contentViewSlice.actions.setEditMetadataActive(isActive ?? false));
}
