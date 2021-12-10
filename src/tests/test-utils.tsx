import React from 'react';
import { ThemeProvider } from 'styled-components';
import { SWRConfig } from 'swr';
import { lightTheme } from '../layouts/theme';

// Return SWRConfig with clear cache.
export const clearSWRCache = ({ children }: any) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

// Return preconfigured Styled Components' ThemeProvider
export const themeProvider = ({ children }: any) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);
