import { createSlice } from '@reduxjs/toolkit';
import { AppState, AppThunk } from '@app/store';

export interface MenuList {
  editMetadata: boolean;
  editContent: boolean;
  // testCrosswalk: boolean;
  publish: boolean;
  invalidate: boolean;
  deprecate: boolean;
  remove: boolean;
  version: boolean;
  mscrCopy: boolean;
  deleteDraft: boolean;
}

const initialMenuList: MenuList = {
  deleteDraft: false,
  deprecate: false,
  editContent: false,
  editMetadata: false,
  invalidate: false,
  mscrCopy: false,
  publish: false,
  remove: false,
  version: false,
};

export interface ModalList {
  form: FormState;
  confirm: ConfirmState;
}

export interface FormState {
  mscrCopy: boolean;
  version: boolean;
}

const initialFormState: FormState = {
  mscrCopy: false,
  version: false
};

export interface ConfirmState {
  deleteDraft: boolean;
  deprecate: boolean;
  invalidate: boolean;
  publish: boolean;
  remove: boolean;
  saveMetadata: boolean;
}

const initialConfirmState: ConfirmState = {
  deleteDraft: false,
  deprecate: false,
  invalidate: false,
  publish: false,
  remove: false,
  saveMetadata: false,
};

const initialModalList: ModalList = {
  confirm: initialConfirmState,
  form: initialFormState,
};

const initialState = {
  isLatest: false,
  isPublished: false,
  isCrosswalk: false,
  menuList: initialMenuList,
  modal: initialModalList,
};

export const actionmenuSlice = createSlice({
  name: 'actionmenu',
  initialState: initialState,
  reducers: {
    setIsLatest(state, action) {
      return {
        ...state,
        isLatest: action.payload
      };
    },
    setIsPublished(state, action) {
      return {
        ...state,
        isPublished: action.payload
      };
    },
    setIsCrosswalk(state, action) {
      return {
        ...state,
        isCrosswalk: action.payload
      };
    },
    setMenuList(state, action) {
      const menuListAddition: Partial<MenuList> = {};
      action.payload.forEach((key: keyof MenuList) => menuListAddition[key] = true);
      return {
        ...state,
        menuList: {
          ...state.menuList,
          ...menuListAddition
        }
      };
    },
    setMenuListFull(state, action) {
      return {
        ...state,
        menuList: action.payload
      };
    },
    setFormState(state, action) {
      return {
        ...state,
        modal: {
          ...initialModalList,
          form: {
            ...initialFormState,
            [action.payload.key]: action.payload.value
          }
        }
      };
    },
    setConfirmState(state, action) {
      return {
        ...state,
        modal: {
          ...initialModalList,
          confirm: {
            ...initialConfirmState,
            [action.payload.key]: action.payload.value
          }
        }
      };
    },
  },
});

export function selectIsLatest() {
  return (state: AppState) => state.actionmenu.isLatest;
}

export function setIsLatest(isLatest?: boolean): AppThunk {
  return (dispatch) =>
    dispatch(actionmenuSlice.actions.setIsLatest(isLatest ?? false));
}

export function selectIsPublished() {
  return (state: AppState) => state.actionmenu.isPublished;
}

export function setIsPublished(isPublished?: boolean): AppThunk {
  return (dispatch) =>
    dispatch(actionmenuSlice.actions.setIsPublished(isPublished ?? false));
}

export function selectIsCrosswalk() {
  return (state: AppState) => state.actionmenu.isCrosswalk;
}

export function setIsCrosswalk(isCrosswalk?: boolean): AppThunk {
  return (dispatch) =>
    dispatch(actionmenuSlice.actions.setIsCrosswalk(isCrosswalk ?? false));
}

export function selectMenuList() {
  return (state: AppState) => state.actionmenu.menuList;
}

export function setMenuList(menuList: Array<keyof MenuList>): AppThunk {
  return (dispatch) => dispatch(actionmenuSlice.actions.setMenuList(menuList));
}

export function resetMenuList(): AppThunk {
  return (dispatch) => dispatch(actionmenuSlice.actions.setMenuListFull(initialMenuList));
}

export function selectModal() {
  return (state: AppState) => state.actionmenu.modal;
}

export function selectFormModalState() {
  return (state: AppState) => state.actionmenu.modal.form;
}

export function setFormModalState(formType: {key: keyof FormState; value: boolean}): AppThunk {
  return (dispatch) => dispatch(actionmenuSlice.actions.setFormState(formType));
}

export function selectConfirmModalState() {
  return (state: AppState) => state.actionmenu.modal.confirm;
}

export function setConfirmModalState(confirmType: {key: keyof ConfirmState; value: boolean}): AppThunk {
  return (dispatch) => dispatch(actionmenuSlice.actions.setConfirmState(confirmType));
}
