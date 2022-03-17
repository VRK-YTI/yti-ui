import { SWRConfig } from 'swr';
import '../../styles/globals.scss';
import type { AppProps } from 'next/app';
import { appWithTranslation, useTranslation } from 'next-i18next';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useStoreDispatch, wrapper } from '../store';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import { VisuallyHidden } from 'suomifi-ui-components';
import { useSelector } from 'react-redux';
import { selectTitle } from '../common/components/title/title.slice';
import { selectLogin } from '../common/components/login/login-slice';
import { setAlert } from '../common/components/alert/alert.slice';

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
      dispatch(setAlert([{
        status: 0,
        data: 'logged-out'
      }]));
    }
  });

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
      <VisuallyHidden>
        <div role='region' aria-live='assertive'>
          {t('navigated-to')} {title}
        </div>
      </VisuallyHidden>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
export default wrapper.withRedux(appWithTranslation(App));
