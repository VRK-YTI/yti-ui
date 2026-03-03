import React from 'react';
import { ThemeProvider } from 'styled-components';
import { SWRConfig } from 'swr';
import { lightTheme } from 'yti-common-ui/theme';
import { NextIronContext } from '@app/store';
import httpMocks, {
  createRequest,
  createResponse,
  RequestOptions,
} from 'node-mocks-http';
import { ParsedUrlQuery } from 'querystring';
import { NextApiRequest, NextApiResponse } from 'next';

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

// Mock context for makeStore()
// Note: We use 'as unknown as NextIronContext' because node-mocks-http types
// don't perfectly match Next.js types, but they're functionally equivalent for testing
export const getMockContext = (options?: {
  reqOptions?: RequestOptions;
  query?: ParsedUrlQuery;
  resolvedUrl?: string;
  locale?: string;
}): NextIronContext => {
  const mockReq = httpMocks.createRequest(options?.reqOptions);
  const mockRes = httpMocks.createResponse();
  return {
    req: { ...mockReq, cookies: {} },
    res: mockRes,
    query: options?.query ?? {},
    resolvedUrl: options?.resolvedUrl ?? '',
    locale: options?.locale ?? 'en',
  } as unknown as NextIronContext;
};

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
