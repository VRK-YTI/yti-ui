import React from 'react';
import { ThemeProvider } from 'styled-components';
import { SWRConfig } from 'swr';
import { lightTheme } from '@app/layouts/theme';
import { NextIronContext } from '@app/store';
import httpMocks, { RequestOptions } from 'node-mocks-http';
import { ParsedUrlQuery } from 'querystring';

interface TestUtilsProps {
  children: React.ReactNode;
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
