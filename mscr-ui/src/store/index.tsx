import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { Context, createWrapper } from 'next-redux-wrapper';
import { NextApiRequest } from 'next';
import { useDispatch } from 'react-redux';
import { loginApi, loginSlice } from '@app/common/components/login/login.slice';
import { serviceCategoriesApi } from '@app/common/components/service-categories/service-categories.slice';
import { organizationsApi } from '@app/common/components/organizations/organizations.slice';
import { fakeableUsersApi } from '@app/common/components/fakeable-users/fakeable-users.slice';
import { prefixApi } from '@app/common/components/prefix';
import { searchInternalResourcesApi } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import {
  resourceApi,
  resourceSlice,
} from '@app/common/components/resource/resource.slice';
import { countApi } from '@app/common/components/counts/counts.slice';

import { visualizationApi } from '@app/common/components/visualization/visualization.slice';
import { activeSlice } from '@app/common/components/active/active.slice';
import { importApi } from '@app/common/components/import/import.slice';
import { schemaApi } from '@app/common/components/schema/schema.slice';
import {
  crosswalkApi,
} from '@app/common/components/crosswalk/crosswalk.slice';
import { mscrSearchApi } from '@app/common/components/mscr-search/mscr-search.slice';
import { crosswalkMappingFunctionsApi } from '@app/common/components/crosswalk-functions/crosswalk-functions.slice';
import { notificationsSlice } from '@app/common/components/notifications/notifications.slice';

// make Context from next-redux-wrapper compatible with next-iron-session
export type NextIronContext = Context | (Context & { req: NextApiRequest });

export function makeStore(ctx: NextIronContext) {
  return configureStore({
    reducer: {
      [loginSlice.name]: loginSlice.reducer,
      [loginApi.reducerPath]: loginApi.reducer,
      [serviceCategoriesApi.reducerPath]: serviceCategoriesApi.reducer,
      [organizationsApi.reducerPath]: organizationsApi.reducer,

      [fakeableUsersApi.reducerPath]: fakeableUsersApi.reducer,
      [prefixApi.reducerPath]: prefixApi.reducer,
      [schemaApi.reducerPath]: schemaApi.reducer,
      [crosswalkApi.reducerPath]: crosswalkApi.reducer,
      [searchInternalResourcesApi.reducerPath]:
        searchInternalResourcesApi.reducer,
      [resourceApi.reducerPath]: resourceApi.reducer,
      [resourceSlice.name]: resourceSlice.reducer,
      [countApi.reducerPath]: countApi.reducer,
      [visualizationApi.reducerPath]: visualizationApi.reducer,
      [activeSlice.name]: activeSlice.reducer,
      [fakeableUsersApi.reducerPath]: fakeableUsersApi.reducer,
      [importApi.reducerPath]: importApi.reducer,
      [crosswalkMappingFunctionsApi.reducerPath]:
        crosswalkMappingFunctionsApi.reducer,
      [mscrSearchApi.reducerPath]: mscrSearchApi.reducer,
      [notificationsSlice.name]: notificationsSlice.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: ctx } }).concat(
        loginApi.middleware,
        serviceCategoriesApi.middleware,
        organizationsApi.middleware,
        fakeableUsersApi.middleware,
        prefixApi.middleware,
        schemaApi.middleware,
        crosswalkApi.middleware,
        searchInternalResourcesApi.middleware,
        resourceApi.middleware,
        countApi.middleware,
        visualizationApi.middleware,
        fakeableUsersApi.middleware,
        importApi.middleware,
        crosswalkMappingFunctionsApi.middleware,
        mscrSearchApi.middleware
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
