import Head from 'next/head';
import React from 'react';
import { SSRConfig, useTranslation } from 'next-i18next';
import Layout from '../layouts/layout';
import TerminologySearch from '../modules/terminology-search';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import { MediaQueryContextProvider } from '../common/components/media-query/media-query-context';

/*
 * @deprecated Search-page has been replaced by Index-page.
 */

export default function SearchPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  console.warn('Search-page has been replaced by Index-page.');

  const { t } = useTranslation('common');

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      <Layout>
        <Head>
          <title>{t('search-title')}</title>
        </Head>
        <TerminologySearch />
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
