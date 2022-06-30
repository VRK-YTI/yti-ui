import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
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
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { getStoreData } from '@app/common/components/page-head/utils';

interface CollectionPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  collectionTitle?: string;
  vocabularyTitle?: string;
}

export default function CollectionPage(props: CollectionPageProps) {
  const { t } = useTranslation('common');
  const { query, asPath } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const collectionId = (query?.collectionId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      {/* todo: use better feedbackSubject once more data is available */}
      <Layout feedbackSubject={`${t('collection-id')} ${collectionId}`}>
        <PageHead
          title={[props.collectionTitle, props.vocabularyTitle]}
          path={asPath}
        />

        <Collection terminologyId={terminologyId} collectionId={collectionId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, params, locale }: LocalHandlerParams) => {
    const terminologyId = Array.isArray(params.terminologyId)
      ? params.terminologyId[0]
      : params.terminologyId;
    const collectionId = Array.isArray(params.collectionId)
      ? params.collectionId[0]
      : params.collectionId;

    if (terminologyId === undefined || collectionId === undefined) {
      throw new Error('Invalid parameters for page');
    }

    store.dispatch(getVocabulary.initiate({ id: terminologyId }));
    store.dispatch(getCollection.initiate({ terminologyId, collectionId }));
    store.dispatch(getCollections.initiate(terminologyId));

    await Promise.all(getVocabularyRunningOperationPromises());
    await Promise.all(getCollectionRunningOperationPromises());

    const vocabularyData = getStoreData({
      state: store.getState(),
      reduxKey: 'vocabularyAPI',
      functionKey: 'getVocabulary',
    });

    const collectionData = getStoreData({
      state: store.getState(),
      reduxKey: 'collectionAPI',
      functionKey: 'getCollection',
    });

    const vocabularyTitle = getPropertyValue({
      property: vocabularyData?.properties?.prefLabel,
      language: locale,
      fallbackLanguage: 'fi',
    });

    const collectionTitle = getPropertyValue({
      property: collectionData?.properties.prefLabel,
      language: locale,
      fallbackLanguage: 'fi',
    });

    return {
      props: {
        collectionTitle: collectionTitle,
        vocabularyTitle: vocabularyTitle,
      },
    };
  }
);
