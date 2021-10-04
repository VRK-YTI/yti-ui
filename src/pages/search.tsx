import Head from 'next/head';
import React, { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SSRConfig, useTranslation } from 'next-i18next';
import { Heading } from 'suomifi-ui-components';
import Layout from '../common/components/layout/layout';
import { TerminologySearchInput } from '../common/components/terminology-search/terminology-search-input';
import { TerminologySearchResults } from '../common/components/terminology-search/terminology-search-results';
import { TerminologySearchResult } from '../common/interfaces/terminology.interface';
import { UserProps } from '../common/interfaces/user-interface';
import withSession, { NextIronRequest } from '../common/utils/session';
import { GetServerSideProps, NextApiResponse } from 'next';

export default function Search(props: {
  _netI18Next: SSRConfig;
}) {
  const { t } = useTranslation('common');

  const [input, setInput] = useState('');
  const [results, setResults] = useState<TerminologySearchResult | null>(null);

  const apiUrl = '/terminology-api/api/v1/frontend/searchTerminology';

  const fetchData = async (keyword: string) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: keyword,
        searchConcepts: true,
        prefLang: 'fi',
        pageSize: 10,
        pageFrom: 0,
      }),
    };

    return await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
      });
  };

  const updateInput = async (input: string) => {
    setInput(input);
    fetchData(input);
  };

  return (
    <Layout>
      <Head>
        <title>{t('search-title')}</title>
      </Head>
      <Heading variant="h1">{t('terminology-title')}</Heading>

      <TerminologySearchInput
        keyword={input}
        setKeyword={(value: string): void => {
          updateInput(value);
        }}
      />

      <TerminologySearchResults results={results} />
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
