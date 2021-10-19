import React from 'react';
import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import store from '../store';
import { Provider } from 'react-redux'

// https://nextjs.org/docs/advanced-features/custom-app
function App({ Component, pageProps }: AppProps) {

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}
export default appWithTranslation(App);
