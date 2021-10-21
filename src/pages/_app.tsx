import React from 'react';
import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '../store';

// https://nextjs.org/docs/advanced-features/custom-app
function App({ Component, pageProps }: AppProps) {

  return (
    <Component {...pageProps} />
  );
}
export default wrapper.withRedux(appWithTranslation(App));
