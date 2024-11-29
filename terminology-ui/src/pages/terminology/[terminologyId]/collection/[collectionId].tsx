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
  getTerminology,
  getRunningQueriesThunk as getVocabularyRunningQueriesThunk,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  CommonContextState,
  CommonContextProvider,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';
import { getStoreData } from '@app/common/utils/get-store-data';
import { wrapper } from '@app/store';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

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

    store.dispatch(getTerminology.initiate({ id: terminologyId }));
    store.dispatch(getCollection.initiate({ terminologyId, collectionId }));
    store.dispatch(getCollections.initiate(terminologyId));

    await Promise.all(store.dispatch(getVocabularyRunningQueriesThunk()));
    await Promise.all(store.dispatch(getCollectionRunningQueriesThunk()));

    const terminologyData = getStoreData({
      state: store.getState(),
      reduxKey: 'terminologyAPI',
      functionKey: 'getTerminology',
    });

    const collectionData = getStoreData({
      state: store.getState(),
      reduxKey: 'collectionAPI',
      functionKey: 'getCollection',
    });

    if (!collectionData) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
      };
    }

    return {
      props: {
        collectionTitle: getLanguageVersion({
          data: collectionData.label,
          lang: locale ?? 'fi',
        }),
        vocabularyTitle: getLanguageVersion({
          data: terminologyData.label,
          lang: locale ?? 'fi',
        }),
      },
    };
  }
);
