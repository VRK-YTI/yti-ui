import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
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

  return (
    <MediaQueryContextProvider value={{ isSSRMobile: props.isSSRMobile }}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('collection-id')} ${collectionId}`}>
        <Head>
          <title>{t('collection-title')}</title>
        </Head>

        <Collection terminologyId={terminologyId} collectionId={collectionId} />
      </Layout>
    </MediaQueryContextProvider>
  );
}
export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, res, locale, store }: LocalHandlerParams) => {
    const ids = req.url?.split('/').filter(part => part.includes('-'));
    const terminologyId = ids?.[0] ?? '';
    const collectionId = ids?.[1].split('.')[0] ?? '';

    await store.dispatch(getVocabulary.initiate(terminologyId));
    await store.dispatch(getCollection.initiate({ terminologyId, collectionId }));
    await store.dispatch(getCollections.initiate(terminologyId));

    await Promise.all(getVocabularyRunningOperationPromises());
    await Promise.all(getCollectionRunningOperationPromises());

    return { props: {}};
  }
);
