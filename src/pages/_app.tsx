import { SWRConfig } from 'swr';
import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import axios from 'axios';
import React from 'react';
import { wrapper } from '../store';

// https://nextjs.org/docs/advanced-features/custom-app
function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url: string, init?: RequestInit) => axios
          .get(url)
          .then(res => res.data),
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
export default wrapper.withRedux(appWithTranslation(App));
