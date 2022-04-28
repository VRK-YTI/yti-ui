import Head from 'next/head';
import React from 'react';
import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import {
  CommonContextProvider,
  CommonContextInterface,
} from '@app/common/components/common-context-provider';
import TerminologySearch from '@app/modules/terminology-search';
import PageTitle from '@app/common/components/page-title';

interface IndexPageProps extends CommonContextInterface {
  _netI18Next: SSRConfig;
}

export default function IndexPage(props: IndexPageProps) {
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageTitle title={t('terminology-site-title')} />
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>

        <TerminologySearch />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
