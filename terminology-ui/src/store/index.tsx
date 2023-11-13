import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import { Context, MakeStore, createWrapper } from 'next-redux-wrapper';
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
import { loginApi, loginSlice } from '@app/common/components/login/login.slice';
import { alertSlice } from '@app/common/components/alert/alert.slice';
import { titleSlice } from '@app/common/components/title/title.slice';
import { subscriptionApi } from '@app/common/components/subscription/subscription.slice';
import { accessRequestApi } from '@app/common/components/access-request/access-request.slice';
import { adminControlsSlice } from '@app/common/components/admin-controls/admin-controls.slice';
import { importApi } from '@app/common/components/import/import.slice';
import { modifyApi } from '@app/common/components/modify/modify.slice';
import { removeApi } from '@app/common/components/remove/remove.slice';
import { NextApiRequest } from 'next';
import { modifyStatusesApi } from '@app/common/components/modify-statuses/modify-statuses.slice';
import { fakeableUsersApi } from '@app/common/components/fakeable-user/fakeable-user.slice';
import { codeListApi } from '@app/common/components/codelist/codelist.slice';

// make Context from next-redux-wrapper compatible with next-iron-session
export type NextIronContext = Context | (Context & { req: NextApiRequest });

const reducers = {
  [terminologySearchSlice.name]: terminologySearchSlice.reducer,
  [terminologySearchApi.reducerPath]: terminologySearchApi.reducer,
  [vocabularySlice.name]: vocabularySlice.reducer,
  [vocabularyApi.reducerPath]: vocabularyApi.reducer,
  [conceptApi.reducerPath]: conceptApi.reducer,
  [collectionApi.reducerPath]: collectionApi.reducer,
  [countsApi.reducerPath]: countsApi.reducer,
  [loginSlice.name]: loginSlice.reducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [alertSlice.name]: alertSlice.reducer,
  [titleSlice.name]: titleSlice.reducer,
  [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  [accessRequestApi.reducerPath]: accessRequestApi.reducer,
  [adminControlsSlice.name]: adminControlsSlice.reducer,
  [importApi.reducerPath]: importApi.reducer,
  [modifyApi.reducerPath]: modifyApi.reducer,
  [removeApi.reducerPath]: removeApi.reducer,
  [modifyStatusesApi.reducerPath]: modifyStatusesApi.reducer,
  [fakeableUsersApi.reducerPath]: fakeableUsersApi.reducer,
  [codeListApi.reducerPath]: codeListApi.reducer,
};

const reducer = combineReducers(reducers);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeStore: MakeStore<any> = ({
  reduxWrapperMiddleware,
  context,
}) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({ thunk: { extraArgument: context } }),
      terminologySearchApi.middleware,
      vocabularyApi.middleware,
      conceptApi.middleware,
      collectionApi.middleware,
      countsApi.middleware,
      subscriptionApi.middleware,
      accessRequestApi.middleware,
      importApi.middleware,
      modifyApi.middleware,
      removeApi.middleware,
      loginApi.middleware,
      modifyStatusesApi.middleware,
      fakeableUsersApi.middleware,
      codeListApi.middleware,
      reduxWrapperMiddleware,
    ],
    // Development tools should be available only in development environments
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
export type AppDispatch = AppStore['dispatch'];
export const useStoreDispatch: () => AppDispatch = useDispatch;

export const wrapper = createWrapper<AppStore>(makeStore);
