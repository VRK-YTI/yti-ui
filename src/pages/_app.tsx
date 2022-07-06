import ReactDOM from 'react-dom';
import { SWRConfig } from 'swr';
import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation, useTranslation } from 'next-i18next';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useStoreDispatch, wrapper } from '@app/store';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import { VisuallyHidden } from 'suomifi-ui-components';
import { useSelector } from 'react-redux';
import { selectTitle } from '@app/common/components/title/title.slice';
import { selectLogin } from '@app/common/components/login/login.slice';
import { setAlert } from '@app/common/components/alert/alert.slice';

// https://nextjs.org/docs/advanced-features/custom-app
function App({ Component, pageProps }: AppProps) {
  const title = useSelector(selectTitle());
  const { t } = useTranslation('common');
  const login = useSelector(selectLogin());
  const dispatch = useStoreDispatch();

  useEffect(() => {
    if (!login.anonymous) {
      window.localStorage.setItem('user-signed', 'true');
    } else if (login.anonymous && window.localStorage.getItem('user-signed')) {
      window.localStorage.removeItem('user-signed');
      dispatch(
        setAlert(
          [
            {
              error: {
                status: 0,
                data: 'logged-out',
              },
              displayText: 'logged-out',
            },
          ],
          []
        )
      );
    }
  });

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

// setup a11y checker for development
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  import('@axe-core/react').then(({ default: axe }) =>
    axe(React, ReactDOM, 1000)
  );
}
