import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Link from 'next/link';
import { Heading, Link as DsLink } from 'suomifi-ui-components';
import Layout from '../../layouts/layout';
import Head from 'next/head';
import { TerminologyInfoContainer } from '../../common/components/terminology/terminology-info.styles';
import { createCommonGetServerSideProps } from '../../common/utils/create-getserversideprops';
import { NextIronRequest } from '../../common/utils/session';
import { NextApiResponse } from 'next';
import User from '../../common/interfaces/user-interface';
import useUser from '../../common/utils/hooks/useUser';
import Vocabulary from '../../common/components/vocabulary/vocabulary';

// TODO: perhaps move the component itself to components/
export default function TerminologyPage(props: {
  _netI18Next: SSRConfig;
  user: User;
}) {
  const { t } = useTranslation('common');
  const { user, } = useUser({ initialData: props.user });
  const { query } = useRouter();
  const id = query?.id ?? null;

  return (
    <Layout user={user}>
      <Head>
        <title>{ t('terminology-title') }</title>
      </Head>

      <Vocabulary id={id}/>
    </Layout>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
    return { props: { } };
  });
