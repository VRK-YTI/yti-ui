import React from 'react';
import { ThemeProvider } from 'styled-components';
import { SWRConfig } from 'swr';
import { lightTheme } from '../components/theme';
import httpMocks, {
  createRequest,
  createResponse,
  RequestOptions,
} from 'node-mocks-http';
import { ParsedUrlQuery } from 'querystring';
import { NextApiRequest, NextApiResponse } from 'next';
import { Context } from 'next-redux-wrapper';

interface TestUtilsProps {
  children: React.ReactNode;
}

export type NextIronContext = Context | (Context & { req: NextApiRequest });

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
