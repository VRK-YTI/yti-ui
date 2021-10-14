import Head from 'next/head';
import React, { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig, useTranslation } from 'next-i18next';
import { Heading } from 'suomifi-ui-components';
import Layout from '../common/components/layout/layout';
import { TerminologySearchInput } from '../common/components/terminology-search/terminology-search-input';
import useTerminologySearch from '../../modules/terminology-search/terminology-search-api'
import { TerminologySearchResults } from '../common/components/terminology-search/terminology-search-results';
import { TerminologySearchResult } from '../common/interfaces/terminology.interface';
import { UserProps } from '../common/interfaces/user-interface';
import { SearchContainer } from '../common/components/terminology-search/terminology-search-input.styles';
import withSession, { NextIronRequest } from '../common/utils/session';
import { GetServerSideProps, NextApiResponse } from 'next';

interface TerminologySearchProps {
  results: TerminologySearchResult | null;
  error: string | null;
  loading: boolean;
}

export default function Search(props: {
  _netI18Next: SSRConfig;
}) {
  const { t } = useTranslation('common');

  const [filter, setFilter] = useState<string | null>(null);
  const { results, error, loading }: TerminologySearchProps = useTerminologySearch(filter);  

  return (
    <Layout>
      <Head>
        <title>{t('search-title')}</title>
      </Head>
      <Heading variant="h1">{t('terminology-title')}</Heading>

      <SearchContainer>
        <TerminologySearchInput
          setFilter={setFilter}
        />
      </SearchContainer>

      <TerminologySearchResults results={results} error={error} loading={loading}/>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = withSession<{ props: UserProps | {} }>(
  async ({ req, res, locale }: { req: NextIronRequest, res: NextApiResponse, locale: string }) => {
    const props: any = {
      ...(await serverSideTranslations(locale, ['common'])),
    };

    return { props: props };
  },
);
