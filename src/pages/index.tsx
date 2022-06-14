import Head from 'next/head';
import React from 'react';
import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import {
  CommonContextProvider,
  CommonContextState,
} from '@app/common/components/common-context-provider';
import TerminologySearch from '@app/modules/terminology-search';
import PageTitle from '@app/common/components/page-title';
import {
  getGroups,
  getOrganizations,
  getRunningOperationPromises as terminologyGetRunningOperationPromises,
} from '@app/common/components/terminology-search/terminology-search.slice';
import {
  getCounts,
  getRunningOperationPromises as countsGetRunningOperationPromises,
} from '@app/common/components/counts/counts.slice';

interface IndexPageProps extends CommonContextState {
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

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, locale }: LocalHandlerParams) => {
    store.dispatch(getGroups.initiate(locale));
    store.dispatch(getOrganizations.initiate(locale));
    store.dispatch(getCounts.initiate(null));

    await Promise.all(terminologyGetRunningOperationPromises());
    await Promise.all(countsGetRunningOperationPromises());

    return {};
  }
);
