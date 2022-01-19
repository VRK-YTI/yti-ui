import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { terminologySearchSlice, terminologySearchApi } from '../common/components/terminology-search/terminology-search-slice';
import { vocabularyApi, vocabularySlice } from '../common/components/vocabulary/vocabulary-slice';
import { conceptApi } from '../common/components/concept/concept-slice';
import { useDispatch } from 'react-redux';
import { collectionApi } from '../common/components/collection/collection-slice';
import { countsApi } from '../common/components/counts/counts-slice';
import { loginSlice } from '../common/components/login/login-slice';

export function makeStore() {
  return configureStore({
    reducer: {
      [terminologySearchSlice.name]: terminologySearchSlice.reducer,
      [terminologySearchApi.reducerPath]: terminologySearchApi.reducer,
      [vocabularySlice.name]: vocabularySlice.reducer,
      [vocabularyApi.reducerPath]: vocabularyApi.reducer,
      [conceptApi.reducerPath]: conceptApi.reducer,
      [collectionApi.reducerPath]: collectionApi.reducer,
      [countsApi.reducerPath]: countsApi.reducer,
      [loginSlice.name]: loginSlice.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        terminologySearchApi.middleware,
        vocabularyApi.middleware,
        conceptApi.middleware,
        collectionApi.middleware,
        countsApi.middleware
      ),
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
export type AppDispatch = (x: AppThunk) => void;
export const useStoreDispatch = () => useDispatch();

export const wrapper = createWrapper<AppStore>(makeStore);
