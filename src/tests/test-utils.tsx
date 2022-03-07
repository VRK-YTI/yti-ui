import React from "react";
import { ThemeProvider } from "styled-components";
import { SWRConfig } from "swr";
import { lightTheme } from "../layouts/theme";

// Return SWRConfig with clear cache.
export const clearSWRCache: React.FC = ({ children }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

// Return preconfigured Styled Components' ThemeProvider
export const themeProvider: React.FC = ({ children }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);
