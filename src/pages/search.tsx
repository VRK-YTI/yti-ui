import Head from 'next/head';
import React, { useState } from 'react';
import { SSRConfig, useTranslation } from 'next-i18next';
import { Heading } from 'suomifi-ui-components';
import Layout from '../common/components/layout/layout';
import { TerminologySearchInput } from '../common/components/terminology-search/terminology-search-input';
import { TerminologySearchResults } from '../common/components/terminology-search/terminology-search-results';
import { UserProps } from '../common/interfaces/user-interface';
import { TerminologySearchResult } from '../common/interfaces/terminology.interface';
import { SearchContainer } from '../common/components/terminology-search/terminology-search-input.styles';
import { NextIronRequest } from '../common/utils/session';
import { NextApiResponse } from 'next';
import { createCommonGetServerSideProps } from '../common/utils/create-getserversideprops';
import User from '../common/interfaces/user-interface';
import useUser from '../common/hooks/useUser';

import { selectFilter, useGetSearchResultQuery } from '../common/components/terminology-search/states/terminology-search-slice';
import { useSelector } from 'react-redux';

export default function SearchPage(props: {
  _netI18Next: SSRConfig;
  user: User;
}) {
  const { t } = useTranslation('common');
  const filter = useSelector(selectFilter());
  const { user, } = useUser({ initialData: props.user });

  const {data, error, isLoading} = useGetSearchResultQuery(filter);

  return (
    <Layout user={user}>
      <Head>
        {console.log(data?.terminologies)}
        <title>{t('search-title')}</title>
      </Head>
      <Heading variant="h1">{t('terminology-title')}</Heading>

      <SearchContainer>
        <TerminologySearchInput />
      </SearchContainer>

      <TerminologySearchResults results={data} />
    </Layout>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
    return { props: { } };
  });
