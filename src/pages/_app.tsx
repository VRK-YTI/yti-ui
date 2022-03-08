import { SWRConfig } from 'swr';
import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation, useTranslation } from 'next-i18next';
import axios from 'axios';
import React from 'react';
import { wrapper } from '../store';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import { VisuallyHidden } from 'suomifi-ui-components';
import { useSelector } from 'react-redux';
import { selectTitle } from '../common/components/title/title.slice';

// https://nextjs.org/docs/advanced-features/custom-app
function App({ Component, pageProps }: AppProps) {
  const title = useSelector(selectTitle());
  const { t } = useTranslation('common');

  return (
    <SWRConfig
      value={{
        fetcher: async (url: string, init?: RequestInit) =>
          axios.get(url).then((res) => res.data),
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <VisuallyHidden>
        <div role="region" aria-live="assertive">
          {t('navigated-to')} {title}
        </div>
      </VisuallyHidden>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
export default wrapper.withRedux(appWithTranslation(App));
