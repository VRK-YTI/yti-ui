import React from 'react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../theme';

export default function CommonWrapper(Component: any) {
  return (props: any) => (
    <ThemeProvider theme={lightTheme}>
      <Component {...props} />
    </ThemeProvider>
  );
}
