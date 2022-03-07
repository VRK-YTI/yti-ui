import { createSlice } from "@reduxjs/toolkit";
import { AppState, AppThunk } from "../../../store";

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

export const setTitle =
  (title: TitleState["title"]): AppThunk =>
  (dispatch) => {
    dispatch(
      titleSlice.actions.setTitle({
        title: title,
      })
    );
  };

export const selectTitle =
  () =>
  (state: AppState): TitleState["title"] =>
    state.title.title;

export default titleSlice.reducer;
