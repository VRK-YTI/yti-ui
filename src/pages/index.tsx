import React from 'react';
import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import {
  CommonContextProvider,
  CommonContextState,
} from '@app/common/components/common-context-provider';
import TerminologySearch from '@app/modules/terminology-search';
import {
  getGroups,
  getOrganizations,
  getRunningOperationPromises as terminologyGetRunningOperationPromises,
  getSearchResult,
} from '@app/common/components/terminology-search/terminology-search.slice';
import {
  getCounts,
  getRunningOperationPromises as countsGetRunningOperationPromises,
} from '@app/common/components/counts/counts.slice';
import PageHead from '@app/common/components/page-head';
import { initialUrlState } from '@app/common/utils/hooks/use-url-state';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function IndexPage(props: IndexPageProps) {
  const { t } = useTranslation('common');

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageHead
          title={t('terminology-site-title')}
          description={t('terminology-search-info')}
        />

        <TerminologySearch />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, locale, query }) => {
    const urlState = Object.assign({}, initialUrlState);

    if (query) {
      if (query.q !== undefined) {
        urlState.q = Array.isArray(query.q) ? query.q[0] : query.q;
      }

      if (query.status !== undefined) {
        urlState.status = Array.isArray(query.status)
          ? query.status
          : [query.status];
      }

      if (query.type !== undefined) {
        urlState.type = Array.isArray(query.type) ? query.type[0] : query.type;
      }

      if (query.domain) {
        urlState.domain = Array.isArray(query.domain)
          ? query.domain
          : [query.domain];
      }

      if (query.organization) {
        urlState.organization = Array.isArray(query.organization)
          ? query.organization[0]
          : query.organization;
      }

      if (query.lang) {
        urlState.lang = Array.isArray(query.lang) ? query.lang[0] : query.lang;
      }
    }

    store.dispatch(
      getSearchResult.initiate({ urlState: urlState, language: locale ?? 'fi' })
    );
    store.dispatch(getGroups.initiate(locale ?? 'fi'));
    store.dispatch(getOrganizations.initiate(locale ?? 'fi'));
    store.dispatch(getCounts.initiate(null));

    await Promise.all(terminologyGetRunningOperationPromises());
    await Promise.all(countsGetRunningOperationPromises());

    return {};
  }
);
