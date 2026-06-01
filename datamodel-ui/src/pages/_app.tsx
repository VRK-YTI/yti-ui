import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import axios from 'axios';
import { wrapper } from '@app/store';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'react-redux';

export default appWithTranslation(App);

function App({ Component, pageProps }: AppProps) {
  const store = wrapper.useStore();

  return (
    <Provider store={store}>
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
    </Provider>
  );
}
