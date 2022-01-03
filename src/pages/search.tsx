import Head from 'next/head';
import React from 'react';
import { SSRConfig, useTranslation } from 'next-i18next';
import Layout from '../layouts/layout';
import TerminologySearch from '../modules/terminology-search';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import User from '../common/interfaces/user-interface';
import useUser from '../common/utils/hooks/useUser';
import { MediaQueryContextProvider } from '../common/components/media-query/media-query-context';
import { useSelector } from 'react-redux';
import { selectLogin } from '../common/components/login/login-slice';


export default function SearchPage(props: {
  _netI18Next: SSRConfig;
  user: User;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { user } = useUser({ initialData: props.user });
  const userT = useSelector(selectLogin());

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      <Layout user={userT}>
        <Head>
          <title>{t('search-title')}</title>
        </Head>
        <TerminologySearch />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
