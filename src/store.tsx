import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { terminologySearchSlice } from './common/components/terminology-search/terminology-search-slice';
import { useDispatch } from 'react-redux';

export function makeStore() {
  return configureStore({
    reducer: {
      [terminologySearchSlice.name]: terminologySearchSlice.reducer,
    },
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export const useStoreDispatch = () => useDispatch();

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper<AppStore>(makeStore);
