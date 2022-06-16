import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '@app/layouts/layout';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Vocabulary from '@app/modules/vocabulary';
import PageTitle from '@app/common/components/page-title';
import {
  getCollections,
  getConceptResult,
  getRunningOperationPromises,
  getVocabulary,
} from '@app/common/components/vocabulary/vocabulary.slice';
import { initialUrlState } from '@app/common/utils/hooks/useUrlState';
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';
import Head from 'next/head';

interface TerminologyPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function TerminologyPage(props: TerminologyPageProps) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const [terminologyTitle, setTerminologyTitle] = useState<
    string | undefined
  >();
  const [terminologyDescription, setTerminologyDescription] = useState<
    string | undefined
  >();

  return (
    <CommonContextProvider value={props}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('terminology-id')} ${terminologyId}`}>
        <PageTitle title={terminologyTitle} />
        <Head>
          <meta
            name="description"
            content={terminologyDescription ?? t('terminology-search-info')}
          />
        </Head>

        <Vocabulary
          id={terminologyId}
          setTerminologyTitle={setTerminologyTitle}
          setTerminologyDescription={setTerminologyDescription}
        />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, store, query, params, locale }: LocalHandlerParams) => {
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

    if (query && query.status !== undefined) {
      urlState.status = Array.isArray(query.status)
        ? query.status
        : [query.status];
    }

    if (query && query.type !== undefined) {
      urlState.type = Array.isArray(query.type) ? query.type[0] : query.type;
    }

    await store.dispatch(getVocabulary.initiate(id));
    await store.dispatch(getCollections.initiate(id));
    await store.dispatch(
      getConceptResult.initiate({ urlState: urlState, id, language: locale })
    );

    await Promise.all(getRunningOperationPromises());

    return {};
  }
);
