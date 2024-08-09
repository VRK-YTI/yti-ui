import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';
import { ContentTab } from '@app/common/interfaces/tabmenu';

const initialState = {
  selectedTab: ContentTab.Metadata,
  isEditContentActive: false,
  isEditMetadataActive: false,
};

export const contentViewSlice = createSlice({
  name: 'contentView',
  initialState: initialState,
  reducers: {
    setSelectedTab(state, action) {
      if (action.payload.tab === ContentTab.Editor) {
        return {
          ...state,
          selectedTab: ContentTab.Editor,
          isEditMetadataActive: false,
        };
      }
      if (action.payload.tab === ContentTab.Metadata) {
        return {
          ...state,
          selectedTab: ContentTab.Metadata,
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
        selectedTab: ContentTab.Editor,
        isEditContentActive: true,
        isEditMetadataActive: false,
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
        selectedTab: ContentTab.Metadata,
        isEditMetadataActive: true,
        isEditContentActive: false,
      };
    },
    setTabAndEdit(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    }
  },
});

export function selectSelectedTab() {
  return (state: AppState) => state.contentView.selectedTab;
}

export function setSelectedTab(tab: number): AppThunk {
  return (dispatch) =>
    dispatch(contentViewSlice.actions.setSelectedTab({ tab }));
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

export function resetContentView(): AppThunk {
  return (dispatch) =>
    dispatch(contentViewSlice.actions.setTabAndEdit(initialState));
}
