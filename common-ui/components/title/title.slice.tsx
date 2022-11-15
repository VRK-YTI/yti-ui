import { createSlice } from "@reduxjs/toolkit";
import { AppState, AppThunk } from "@app/store";

export interface TitleState {
  title: string;
}

export const titleInitialState = {
  title: "",
};

export const titleSlice = createSlice({
  name: "title",
  initialState: titleInitialState,
  reducers: {
    setTitle(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export function setTitle(title: TitleState["title"]): AppThunk {
  return (dispatch) =>
    dispatch(
      titleSlice.actions.setTitle({
        title: title,
      })
    );
}

export function selectTitle() {
  return (state: AppState): TitleState["title"] => state.title.title;
}

export default titleSlice.reducer;
