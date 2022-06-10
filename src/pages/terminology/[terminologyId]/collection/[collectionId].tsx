import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React, { useState } from 'react';
import Layout from '@app/layouts/layout';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Collection from '@app/modules/collection';
import {
  getCollection,
  getCollections,
  getRunningOperationPromises as getCollectionRunningOperationPromises,
} from '@app/common/components/collection/collection.slice';
import {
  getVocabulary,
  getRunningOperationPromises as getVocabularyRunningOperationPromises,
} from '@app/common/components/vocabulary/vocabulary.slice';
import PageTitle from '@app/common/components/page-title';
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';

interface CollectionPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function CollectionPage(props: CollectionPageProps) {
  const { t } = useTranslation('common');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const collectionId = (query?.collectionId ?? '') as string;
  const [collectionTitle, setCollectionTitle] = useState<string | undefined>();

  return (
    <CommonContextProvider value={props}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('collection-id')} ${collectionId}`}>
        <PageTitle title={collectionTitle} />

        <Collection
          terminologyId={terminologyId}
          collectionId={collectionId}
          setCollectionTitle={setCollectionTitle}
        />
      </Layout>
    </CommonContextProvider>
  );
}
export const getServerSideProps = createCommonGetServerSideProps(
  async ({ req, store, params }: LocalHandlerParams) => {
    const terminologyId = Array.isArray(params.terminologyId)
      ? params.terminologyId[0]
      : params.terminologyId;
    const collectionId = Array.isArray(params.collectionId)
      ? params.collectionId[0]
      : params.collectionId;

    if (terminologyId === undefined || collectionId === undefined) {
      throw new Error('Invalid parameters for page');
    }

    const JSESSIONID = req.session.get('cookies')?.JSESSIONID ?? null;

    store.dispatch(getVocabulary.initiate({ id: terminologyId, JSESSIONID }));
    store.dispatch(
      getCollection.initiate({ terminologyId, collectionId, JSESSIONID })
    );
    store.dispatch(getCollections.initiate(terminologyId));

    await Promise.all(getVocabularyRunningOperationPromises());
    await Promise.all(getCollectionRunningOperationPromises());

    return {};
  }
);
