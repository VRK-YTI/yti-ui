/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components';
import { SWRConfig } from 'swr';
import { lightTheme } from 'yti-common-ui/layout/theme';
import { NextIronContext } from '@app/store';
import httpMocks, {
  createRequest,
  createResponse,
  RequestOptions,
} from 'node-mocks-http';
import { ParsedUrlQuery } from 'querystring';
import { NextApiRequest, NextApiResponse } from 'next';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import type { AppStore } from '@app/store';
import { loginSlice } from '@app/common/components/login/login.slice';

interface TestUtilsProps {
  children: React.ReactNode;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<any>;
  store?: AppStore;
}

// Return SWRConfig with clear cache.
export const clearSWRCache = ({ children }: TestUtilsProps) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

// Return preconfigured Styled Components' ThemeProvider
export const themeProvider = ({ children }: TestUtilsProps) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

// mock context for makeStore()
export const getMockContext = (options?: {
  reqOptions?: RequestOptions;
  query?: ParsedUrlQuery;
  resolvedUrl?: string;
  locale?: string;
}): NextIronContext => ({
  req: httpMocks.createRequest(options?.reqOptions),
  res: httpMocks.createResponse(),
  query: options?.query ?? {},
  resolvedUrl: options?.resolvedUrl ?? '',
  locale: options?.locale ?? 'en',
});

export type ApiRequest = NextApiRequest & ReturnType<typeof createRequest>;
export type ApiResponse = NextApiResponse & ReturnType<typeof createResponse>;

export function getHeader(
  header: string | number | string[] | undefined
): string[] {
  if (Array.isArray(header)) {
    return header;
  }

  if (typeof header === 'number' || typeof header === 'string') {
    return [header.toString()];
  }

  return [];
}

interface SliceType {
  middleware?: any;
  name?: string;
  reducerPath?: string;
  reducer: unknown;
}

// Render with store and theme provider
export function renderWithProviders(
  ui: React.ReactElement,
  slices?: SliceType[],
  {
    preloadedState = {},
    store = configureStore({
      reducer: getReducers(slices),
      middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        ...getMiddlewares(slices),
      ],
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

const getMiddlewares = (slices?: SliceType[]) => {
  if (!slices || slices.length === 0) {
    return [];
  }

  return slices.map((slice) => slice.middleware).filter(Boolean);
};

const getReducers = (slices?: SliceType[]) => {
  if (!slices || slices.length === 0) {
    return combineReducers(getPreferredReducers());
  }

  const reducers = slices.reduce((acc: { [key: string]: unknown }, slice) => {
    const key = getSliceKey(slice);
    acc[key] = slice.reducer;
    return acc;
  }, {});

  return combineReducers({
    ...getPreferredReducers(),
    ...reducers,
  });
};

const getSliceKey = (slice: SliceType) => slice.name ?? slice.reducerPath ?? '';

const getPreferredReducers = () => ({
  [loginSlice.name]: loginSlice.reducer,
});
