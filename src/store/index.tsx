import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { Context, createWrapper } from 'next-redux-wrapper';
import {
  terminologySearchSlice,
  terminologySearchApi,
} from '@app/common/components/terminology-search/terminology-search.slice';
import {
  vocabularyApi,
  vocabularySlice,
} from '@app/common/components/vocabulary/vocabulary.slice';
import { conceptApi } from '@app/common/components/concept/concept.slice';
import { useDispatch } from 'react-redux';
import { collectionApi } from '@app/common/components/collection/collection.slice';
import { countsApi } from '@app/common/components/counts/counts.slice';
import { loginSlice } from '@app/common/components/login/login.slice';
import { alertSlice } from '@app/common/components/alert/alert.slice';
import { titleSlice } from '@app/common/components/title/title.slice';
import { subscriptionApi } from '@app/common/components/subscription/subscription.slice';
import { accessRequestApi } from '@app/common/components/access-request/access-request.slice';
import { adminControlsSlice } from '@app/common/components/admin-controls/admin-controls.slice';
import { excelApi } from '@app/common/components/excel/excel.slice';
import { NextIronRequest } from '@app/common/utils/session';
import { modifyApi } from '@app/common/components/modify/modify.slice';

// make Context from next-redux-wrapper compatible with next-iron-session
export type NextIronContext = Context | (Context & { req: NextIronRequest });

export function makeStore(ctx: NextIronContext) {
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
      [alertSlice.name]: alertSlice.reducer,
      [titleSlice.name]: titleSlice.reducer,
      [subscriptionApi.reducerPath]: subscriptionApi.reducer,
      [accessRequestApi.reducerPath]: accessRequestApi.reducer,
      [adminControlsSlice.name]: adminControlsSlice.reducer,
      [excelApi.reducerPath]: excelApi.reducer,
      [modifyApi.reducerPath]: modifyApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: ctx } }).concat(
        terminologySearchApi.middleware,
        vocabularyApi.middleware,
        conceptApi.middleware,
        collectionApi.middleware,
        countsApi.middleware,
        subscriptionApi.middleware,
        accessRequestApi.middleware,
        excelApi.middleware,
        modifyApi.middleware,
      ),

    // Development tools should be available only in development environments
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
export type AppDispatch = AppStore['dispatch'];
export const useStoreDispatch = (): AppDispatch => useDispatch();

export const wrapper = createWrapper<AppStore>(makeStore, {
  serializeState: (state) => JSON.stringify(state),
  deserializeState: (state) => JSON.parse(state),
});
