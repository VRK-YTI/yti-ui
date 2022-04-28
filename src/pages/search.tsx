import React from 'react';
import { SSRConfig } from 'next-i18next';
import Layout from '@app/layouts/layout';
import TerminologySearch from '@app/modules/terminology-search';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import PageTitle from '@app/common/components/page-title';
import {
  CommonContextInterface,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';

/*
 * @deprecated Search-page has been replaced by Index-page.
 */

interface SearchPageProps extends CommonContextInterface {
  _netI18Next: SSRConfig;
}

export default function SearchPage(props: SearchPageProps) {
  console.warn('Search-page has been replaced by Index-page.');

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageTitle />
        <TerminologySearch />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
