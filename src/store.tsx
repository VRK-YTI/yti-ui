import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { terminologySearchSlice, terminologySearchApi } from './common/components/terminology-search/terminology-search-slice';
import { useDispatch } from 'react-redux';

export function makeStore() {
  return configureStore({
    // All slices should be added here to access them
    reducer: {
      [terminologySearchSlice.name]: terminologySearchSlice.reducer,
      [terminologySearchApi.reducerPath]: terminologySearchApi.reducer,
    },

    // All new api's should be added here to access them
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        terminologySearchApi.middleware
      ),
    devTools: true,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;

// TODO: It would be great if useStoreDispatch could be used without first assigning it to a variable in component(s)
export const useStoreDispatch = () => useDispatch();

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper<AppStore>(makeStore);
