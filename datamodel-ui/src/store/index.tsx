import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import { Context, MakeStore, createWrapper } from 'next-redux-wrapper';
import { NextApiRequest } from 'next';
import { useDispatch } from 'react-redux';
import { loginApi, loginSlice } from '@app/common/components/login/login.slice';
import { serviceCategoriesApi } from '@app/common/components/service-categories/service-categories.slice';
import { organizationsApi } from '@app/common/components/organizations/organizations.slice';
import { searchModelsApi } from '@app/common/components/search-models/search-models.slice';
import { fakeableUsersApi } from '@app/common/components/fakeable-users/fakeable-users.slice';
import { prefixApi } from '@app/common/components/prefix/prefix.slice';
import { modelApi, modelSlice } from '@app/common/components/model/model.slice';
import { classApi, classSlice } from '@app/common/components/class/class.slice';
import { searchInternalResourcesApi } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import {
  resourceApi,
  resourceSlice,
} from '@app/common/components/resource/resource.slice';
import { searchTerminologyApi } from '@app/common/components/terminology-search/search-terminology.slice';
import { countApi } from '@app/common/components/counts/counts.slice';
import { conceptSearchApi } from '@app/common/components/concept-search/concept-search.slice';
import { graphSlice } from '@app/common/components/graph/graph.slice';
import { visualizationApi } from '@app/common/components/visualization/visualization.slice';
import { activeSlice } from '@app/common/components/active/active.slice';
import { codeApi } from '@app/common/components/code/code.slice';
import { datatypesApi } from '@app/common/components/datatypes/datatypes.slice';
import { namespacesApi } from '@app/common/components/namespaces/namespaces.slice';
import { notificationsSlice } from '@app/common/components/notifications/notifications.slice';
import { requestApi } from '@app/common/components/requests/requests.slice';
import { subscriptionApi } from '@app/common/components/subscription/subscription.slice';
import { tagInvalidatorMiddleware } from './tag-invalidator-middleware';

// make Context from next-redux-wrapper compatible with next-iron-session
export type NextIronContext = Context | (Context & { req: NextApiRequest });

const reducers = {
  [loginSlice.name]: loginSlice.reducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [serviceCategoriesApi.reducerPath]: serviceCategoriesApi.reducer,
  [organizationsApi.reducerPath]: organizationsApi.reducer,
  [searchModelsApi.reducerPath]: searchModelsApi.reducer,
  [fakeableUsersApi.reducerPath]: fakeableUsersApi.reducer,
  [prefixApi.reducerPath]: prefixApi.reducer,
  [modelApi.reducerPath]: modelApi.reducer,
  [modelSlice.name]: modelSlice.reducer,
  [classApi.reducerPath]: classApi.reducer,
  [classSlice.name]: classSlice.reducer,
  [searchInternalResourcesApi.reducerPath]: searchInternalResourcesApi.reducer,
  [resourceApi.reducerPath]: resourceApi.reducer,
  [resourceSlice.name]: resourceSlice.reducer,
  [searchTerminologyApi.reducerPath]: searchTerminologyApi.reducer,
  [countApi.reducerPath]: countApi.reducer,
  [conceptSearchApi.reducerPath]: conceptSearchApi.reducer,
  [graphSlice.name]: graphSlice.reducer,
  [visualizationApi.reducerPath]: visualizationApi.reducer,
  [activeSlice.name]: activeSlice.reducer,
  [codeApi.reducerPath]: codeApi.reducer,
  [datatypesApi.reducerPath]: datatypesApi.reducer,
  [namespacesApi.reducerPath]: namespacesApi.reducer,
  [notificationsSlice.name]: notificationsSlice.reducer,
  [requestApi.reducerPath]: requestApi.reducer,
  [subscriptionApi.reducerPath]: subscriptionApi.reducer,
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
      tagInvalidatorMiddleware.middleware,
      loginApi.middleware,
      serviceCategoriesApi.middleware,
      organizationsApi.middleware,
      searchModelsApi.middleware,
      fakeableUsersApi.middleware,
      prefixApi.middleware,
      modelApi.middleware,
      classApi.middleware,
      searchInternalResourcesApi.middleware,
      resourceApi.middleware,
      searchTerminologyApi.middleware,
      countApi.middleware,
      conceptSearchApi.middleware,
      visualizationApi.middleware,
      codeApi.middleware,
      datatypesApi.middleware,
      namespacesApi.middleware,
      requestApi.middleware,
      subscriptionApi.middleware,
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
