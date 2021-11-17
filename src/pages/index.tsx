import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Layout from '../common/components/layout/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { NextIronRequest } from '../common/utils/session';
import useUser from '../common/hooks/useUser';
import { NextApiResponse } from 'next';
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
        <Link href="/search">
          <a>{ t('terminology-search') }</a>
        </Link>
      </section>
    </Layout>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
    return { props: { } };
  });
