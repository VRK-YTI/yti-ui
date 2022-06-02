import Head from 'next/head';
import React from 'react';
import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import {
  CommonContextProvider,
  CommonContextState,
} from '@app/common/components/common-context-provider';
import TerminologySearch from '@app/modules/terminology-search';
import PageTitle from '@app/common/components/page-title';
import {
  getGroups,
  getOrganizations,
  getSearchResult,
} from '@app/common/components/terminology-search/terminology-search.slice';
import { getCounts } from '@app/common/components/counts/counts.slice';
import { initialUrlState } from '@app/common/utils/hooks/useUrlState';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function IndexPage(props: IndexPageProps) {
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageTitle title={t('terminology-site-title')} />
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>

        <TerminologySearch />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, locale, query }: LocalHandlerParams) => {
    const urlState = Object.assign({}, initialUrlState);

    if (query && query.q !== undefined) {
      urlState.q = Array.isArray(query.q) ? query.q[0] : query.q;
    }

    if (query && query.status !== undefined) {
      urlState.status = Array.isArray(query.status)
        ? query.status
        : [query.status];
    }

    if (query && query.type !== undefined) {
      urlState.type = Array.isArray(query.type) ? query.type[0] : query.type;
    }

    if (query && query.domain) {
      urlState.domain = Array.isArray(query.domain)
        ? query.domain
        : [query.domain];
    }

    if (query && query.organization) {
      urlState.organization = Array.isArray(query.organization)
        ? query.organization[0]
        : query.organization;
    }

    if (query && query.lang) {
      urlState.lang = Array.isArray(query.lang) ? query.lang[0] : query.lang;
    }

    await store.dispatch(getSearchResult.initiate({ urlState: urlState, language: locale }));
    await store.dispatch(getGroups.initiate(locale));
    await store.dispatch(getOrganizations.initiate(locale));
    await store.dispatch(getCounts.initiate(null));

    return {};
  }
);
