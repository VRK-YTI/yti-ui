import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '@app/common/components/layout';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Vocabulary from '@app/modules/vocabulary';
import {
  getConceptResult,
  getRunningQueriesThunk,
  getVocabulary,
} from '@app/common/components/vocabulary/vocabulary.slice';
import { initialUrlState } from '@app/common/utils/hooks/use-url-state';
import {
  CommonContextState,
  CommonContextProvider,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { getStoreData } from '@app/common/utils/get-store-data';
import {
  getVocabularyCount,
  getStatusCounts,
  getRunningQueriesThunk as countsGetRunningQueriesThunk,
} from '@app/common/components/counts/counts.slice';
import { wrapper } from '@app/store';

interface TerminologyPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  title?: string;
  description?: string;
}

export default function TerminologyPage(props: TerminologyPageProps) {
  wrapper.useHydration(props);

  const { t } = useTranslation('common');
  const { query, asPath } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user}
        fakeableUsers={props.fakeableUsers}
        feedbackSubject={`${t('feedback-vocabulary')} - ${props.title}`}
      >
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
          title={props.title ?? ''}
          description={props.description ?? ''}
          path={asPath}
        />

        <Vocabulary id={terminologyId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, params, locale }: LocalHandlerParams) => {
    if (!params) {
      throw new Error('Missing parameters for page');
    }

    const id = Array.isArray(params.terminologyId)
      ? params.terminologyId[0]
      : params.terminologyId;

    if (id === undefined) {
      throw new Error('Invalid parameter for page');
    }

    const urlState = Object.assign({}, initialUrlState);

    if (query && query.q !== undefined) {
      urlState.q = Array.isArray(query.q) ? query.q[0] : query.q;
    }

    if (query && query.page !== undefined) {
      const pageValue = Array.isArray(query.page)
        ? parseInt(query.page[0], 10)
        : parseInt(query.page, 10);
      urlState.page = !isNaN(pageValue) ? pageValue : initialUrlState.page;
    }

    if (query && query.status !== undefined) {
      urlState.status = Array.isArray(query.status)
        ? query.status
        : [query.status];
    }

    if (query && query.type !== undefined) {
      urlState.type = Array.isArray(query.type) ? query.type[0] : query.type;
    }

    store.dispatch(getVocabulary.initiate({ id }));
    store.dispatch(
      getConceptResult.initiate({
        urlState: urlState,
        id,
        language: locale ?? 'fi',
      })
    );
    store.dispatch(getVocabularyCount.initiate(id));
    store.dispatch(getStatusCounts.initiate(id));

    await Promise.all(store.dispatch(getRunningQueriesThunk()));
    await Promise.all(store.dispatch(countsGetRunningQueriesThunk()));

    const vocabularyData = getStoreData({
      state: store.getState(),
      reduxKey: 'vocabularyAPI',
      functionKey: 'getVocabulary',
    });

    const title = getPropertyValue({
      property: vocabularyData?.properties?.prefLabel,
      language: locale,
    });

    const description = getPropertyValue({
      property: vocabularyData?.properties?.description,
      language: locale,
    });

    return {
      props: {
        title: title,
        description: description,
      },
    };
  }
);
