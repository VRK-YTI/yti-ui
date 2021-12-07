import Head from 'next/head';
import React from 'react';
import { SSRConfig, useTranslation } from 'next-i18next';
import { Heading } from 'suomifi-ui-components';
import Layout from '../layouts/layout';
import TerminologySearch from '../modules/terminology-search';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import User from '../common/interfaces/user-interface';
import useUser from '../common/utils/hooks/useUser';
import { MediaQueryContextProvider } from '../common/components/media-query/media-query-context';


export default function SearchPage(props: {
  _netI18Next: SSRConfig;
  user: User;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { user } = useUser({ initialData: props.user });

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      <Layout user={user}>
        <Head>
          <title>{t('search-title')}</title>
        </Head>
        <Heading variant="h1">{t('terminology-title')}</Heading>

        <TerminologySearch />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
