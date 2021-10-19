import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import terminologySearchReducer from './common/components/terminology-search/terminology-search-slice'

export function makeStore() {
  return configureStore({
    reducer: { terminologySearch: terminologySearchReducer },
  });
};

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
