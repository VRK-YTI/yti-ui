import React from 'react';
import { ThemeProvider } from 'styled-components';
import { SWRConfig } from 'swr';
import { lightTheme } from '../layouts/theme';

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
