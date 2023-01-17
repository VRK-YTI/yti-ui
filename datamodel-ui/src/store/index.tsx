import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { Context, createWrapper } from 'next-redux-wrapper';
import { NextApiRequest } from 'next';
import { useDispatch } from 'react-redux';
import { loginApi, loginSlice } from '@app/common/components/login/login.slice';
import { serviceCategoriesApi } from '@app/common/components/service-categories/service-categories.slice';
import { organizationsApi } from '@app/common/components/organizations/organizations.slice';
import { searchModelsApi } from '@app/common/components/search-models/search-models.slice';
import { fakeableUsersApi } from '@app/common/components/fakeable-users/fakeable-users.slice';
import { modelApi } from '@app/common/components/model/model.slice';

// make Context from next-redux-wrapper compatible with next-iron-session
export type NextIronContext = Context | (Context & { req: NextApiRequest });

export function makeStore(ctx: NextIronContext) {
  return configureStore({
    reducer: {
      [loginSlice.name]: loginSlice.reducer,
      [loginApi.reducerPath]: loginApi.reducer,
      [serviceCategoriesApi.reducerPath]: serviceCategoriesApi.reducer,
      [organizationsApi.reducerPath]: organizationsApi.reducer,
      [searchModelsApi.reducerPath]: searchModelsApi.reducer,
      [fakeableUsersApi.reducerPath]: fakeableUsersApi.reducer,
      [modelApi.reducerPath]: modelApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: ctx } }).concat(
        loginApi.middleware,
        serviceCategoriesApi.middleware,
        organizationsApi.middleware,
        searchModelsApi.middleware,
        fakeableUsersApi.middleware,
        modelApi.middleware
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
export const useStoreDispatch: () => AppDispatch = useDispatch;

export const wrapper = createWrapper<AppStore>(makeStore, {
  serializeState: (state) => JSON.stringify(state),
  deserializeState: (state) => JSON.parse(state),
});
