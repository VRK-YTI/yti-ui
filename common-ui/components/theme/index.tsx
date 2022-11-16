import { DefaultTheme } from 'styled-components';
import { DesignTokens, suomifiDesignTokens } from 'suomifi-ui-components';

// https://nyxo.app/fi/tips-for-using-typescript-with-styled-components/

declare module 'styled-components' {
  export interface DefaultTheme {
    primaryColor: string;
    suomifi: DesignTokens;
  }
}

export const lightTheme: DefaultTheme = {
  primaryColor: '#ccc',
  suomifi: suomifiDesignTokens,
};
