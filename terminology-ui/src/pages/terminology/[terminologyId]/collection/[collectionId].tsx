import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/dist/client/router';
import React from 'react';
import Layout from '@app/common/components/layout';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Collection from '@app/modules/collection';
import {
  getCollection,
  getCollections,
  getRunningQueriesThunk as getCollectionRunningQueriesThunk,
} from '@app/common/components/collection/collection.slice';
import {
  getVocabulary,
  getRunningQueriesThunk as getVocabularyRunningQueriesThunk,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  CommonContextState,
  CommonContextProvider,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { getStoreData } from '@app/common/utils/get-store-data';
import { wrapper } from '@app/store';

interface CollectionPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  collectionTitle?: string;
  vocabularyTitle?: string;
}

export default function CollectionPage(props: CollectionPageProps) {
  wrapper.useHydration(props);
  const { t } = useTranslation('common');
  const { query, asPath } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;
  const collectionId = (query?.collectionId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user}
        fakeableUsers={props.fakeableUsers}
        feedbackSubject={`${t('feedback-collection')} - ${
          props.collectionTitle
        }`}
      >
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
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
    if (!params) {
      throw new Error('Missing parameters for page');
    }

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

    await Promise.all(store.dispatch(getVocabularyRunningQueriesThunk()));
    await Promise.all(store.dispatch(getCollectionRunningQueriesThunk()));

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
    });

    if (!collectionData) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    const collectionTitle = getPropertyValue({
      property: collectionData?.properties.prefLabel,
      language: locale,
    });

    return {
      props: {
        collectionTitle: collectionTitle,
        vocabularyTitle: vocabularyTitle,
      },
    };
  }
);
