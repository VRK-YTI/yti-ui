import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Layout from '../layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import useUser from '../common/utils/hooks/useUser';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import User from '../common/interfaces/user-interface';
import useIsSmall from '../common/hooks/useIsSmall';

export default function IndexPage(props: {
  _netI18Next: SSRConfig;
  user: User;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { user, } = useUser({ initialData: props.user });
  const isSmall = useIsSmall(props.isSSRMobile);

  return (
    <Layout user={user} isSmall={isSmall}>
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
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
