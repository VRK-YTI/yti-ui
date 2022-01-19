import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Layout from '../layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import { MediaQueryContextProvider } from '../common/components/media-query/media-query-context';

export default function IndexPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      <Layout>
        <Head>
          <title>{ t('terminology-site-title') }</title>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <section>
          <Link href="/search?page=1">
            <a>{ t('terminology-search') }</a>
          </Link>
        </section>
      </Layout>
    </MediaQueryContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
