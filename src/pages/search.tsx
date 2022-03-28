import React from 'react';
import { SSRConfig } from 'next-i18next';
import Layout from '@app/layouts/layout';
import TerminologySearch from '@app/modules/terminology-search';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import { MediaQueryContextProvider } from '@app/common/components/media-query/media-query-context';
import PageTitle from '@app/common/components/page-title';

/*
 * @deprecated Search-page has been replaced by Index-page.
 */

export default function SearchPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  console.warn('Search-page has been replaced by Index-page.');

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      <Layout>
        <PageTitle />
        <TerminologySearch />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
