import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import 'bootstrap/dist/css/bootstrap-grid.css';
import { SWRConfig } from 'swr';
import axios from 'axios';
import { wrapper } from '@app/store';
import { appWithTranslation } from 'next-i18next';
import './mscr-style-customizations.scss';


function App({ Component, pageProps }: AppProps) {
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
      {/*
      TODO:
      <VisuallyHidden>
        <div role="region" aria-live="assertive">
          {t('navigated-to')} {title}
        </div>
      </VisuallyHidden> */}
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default wrapper.withRedux(appWithTranslation(App));
