import Head from 'next/head';
import React from 'react';
import { SSRConfig, useTranslation } from 'next-i18next';
import { Heading } from 'suomifi-ui-components';
import Layout from '../layouts/layout';
import { TerminologySearchResults } from '../common/components/terminology-search/terminology-search-results';
import { NextIronRequest } from '../common/utils/session';
import { NextApiResponse } from 'next';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import User from '../common/interfaces/user-interface';
import useUser from '../common/utils/hooks/useUser';
import { selectFilter, useGetSearchResultQuery } from '../common/components/terminology-search/terminology-search-slice';
import { useSelector } from 'react-redux';
import { AppStore } from '../store';

export default function SearchPage(props: {
  _netI18Next: SSRConfig;
  user: User;
}) {
  const { t } = useTranslation('common');
  const filter = useSelector(selectFilter());
  const { user, } = useUser({ initialData: props.user });

  const { data } = useGetSearchResultQuery(filter);

  return (
    <Layout user={user}>
      <Head>
        <title>{t('search-title')}</title>
      </Head>
      <Heading variant="h1">{t('terminology-title')}</Heading>

      <TerminologySearchResults results={data} />
    </Layout>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, res, locale, store }: { req: NextIronRequest, res: NextApiResponse, locale: string, store: AppStore }) => {
    return { props: {} };
  }
);
