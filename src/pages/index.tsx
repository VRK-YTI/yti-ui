import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Layout from '../layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { NextIronRequest } from '../common/utils/session';
import useUser from '../common/hooks/useUser';
import { NextApiResponse } from 'next';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import User from '../common/interfaces/user-interface';

export default function IndexPage(props: {
  _netI18Next: SSRConfig;
  user: User;
}) {
  const { t } = useTranslation('common');
  const { user, } = useUser({ initialData: props.user });

  return (
    <Layout user={user}>
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
