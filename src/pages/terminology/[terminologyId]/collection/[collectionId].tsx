import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '../../../../layouts/layout';
import Head from 'next/head';
import { createCommonGetServerSideProps } from '../../../../common/utils/create-getserversideprops';
import { MediaQueryContextProvider } from '../../../../common/components/media-query/media-query-context';
import Collection from '../../../../modules/collection';
import { LocalHandlerParams } from '../../../../common/utils/create-getserversideprops';
import {
  getCollection,
  getCollections,
  getRunningOperationPromises as getCollectionRunningOperationPromises
} from '../../../../common/components/collection/collection-slice';
import {
  getVocabulary,
  getRunningOperationPromises as getVocabularyRunningOperationPromises
} from '../../../../common/components/vocabulary/vocabulary-slice';

export default function CollectionPage(props: {
  _netI18Next: SSRConfig;
  isSSRMobile: boolean;
}) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const collectionId = (query?.collectionId ?? '') as string;
  const [collectionTitle, setCollectionTitle] = useState<string>('');

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('collection-id')} ${collectionId}`}>
        <Head>
          <title>{collectionTitle ?? t('collection-page')} | {t('site-title')}</title>
        </Head>

        <Collection terminologyId={terminologyId} collectionId={collectionId} setCollectionTitle={setCollectionTitle} />
      </Layout>
    </MediaQueryContextProvider>
  );
}
export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, store, params }: LocalHandlerParams) => {

    const terminologyId = Array.isArray(params.terminologyId) ?
      params.terminologyId[0] : params.terminologyId;
    const collectionId = Array.isArray(params.collectionId) ?
      params.collectionId[0] : params.collectionId;

    if (terminologyId === undefined || collectionId === undefined) {
      throw new Error('Invalid parameters for page');
    }

    store.dispatch(getVocabulary.initiate(terminologyId));
    store.dispatch(getCollection.initiate({ terminologyId, collectionId }));
    store.dispatch(getCollections.initiate(terminologyId));

    await Promise.all(getVocabularyRunningOperationPromises());
    await Promise.all(getCollectionRunningOperationPromises());

    return { props: {}};
  }
);
