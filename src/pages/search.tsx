import Head from 'next/head';
import React from 'react';
import { SSRConfig, useTranslation } from 'next-i18next';
import { Heading } from 'suomifi-ui-components';
import Layout from '../common/components/layout/layout';
import TerminologySearch from '../common/components/terminology-search/terminology-search';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import User from '../common/interfaces/user-interface';
import useUser from '../common/hooks/useUser';

export default function SearchPage(props: {
  _netI18Next: SSRConfig;
  user: User;
}) {
  const { t } = useTranslation('common');
  const { user } = useUser({ initialData: props.user });

  return (
    <Layout user={user}>
      <Head>
        <title>{t('search-title')}</title>
      </Head>
      <Heading variant="h1">{t('terminology-title')}</Heading>

      <TerminologySearch />
    </Layout>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
