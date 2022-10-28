import {
  getCollection,
  getRunningOperationPromises as getCollectionRunningOperationPromises,
} from '@app/common/components/collection/collection.slice';
import {
  CommonContextProvider,
  CommonContextState,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';
import { getStoreData } from '@app/common/components/page-head/utils';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import {
  getVocabulary,
  getRunningOperationPromises,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Layout from '@app/layouts/layout';
import EditCollection from '@app/modules/edit-collection';
import { SSRConfig } from 'next-i18next';

interface CollectionEditPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  collectionLabel: string;
  terminologyId: string;
  collectionInfo: {
    collectionId: string;
    createdBy: string;
    collectionCode: string;
    collectionUri: string;
  };
}

export default function CollectionEdit(props: CollectionEditPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageHead
          title={props.collectionLabel}
          siteTitle="Yhteentoimivuusalusta"
        />

        <EditCollection
          terminologyId={props.terminologyId}
          collectionName={props.collectionLabel}
          collectionInfo={props.collectionInfo}
        />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, locale }: LocalHandlerParams) => {
    const collectionId = Array.isArray(query.collectionId)
      ? query.collectionId[0]
      : query.collectionId;

    const terminologyId = Array.isArray(query.terminologyId)
      ? query.terminologyId[0]
      : query.terminologyId;

    if (collectionId === undefined || terminologyId === undefined) {
      throw new Error('Invalid parameter for page');
    }

    store.dispatch(getVocabulary.initiate({ id: terminologyId }));
    store.dispatch(
      getCollection.initiate({
        collectionId: collectionId,
        terminologyId: terminologyId,
      })
    );
    await Promise.all(getCollectionRunningOperationPromises());
    await Promise.all(getRunningOperationPromises());

    const collectionData = getStoreData({
      state: store.getState(),
      reduxKey: 'collectionAPI',
      functionKey: 'getCollection',
    });

    const collectionLabel = getPropertyValue({
      property: collectionData?.properties?.prefLabel,
      language: locale,
    });

    return {
      props: {
        collectionLabel: collectionLabel,
        terminologyId: terminologyId,
        collectionInfo: {
          collectionId: collectionId,
          createdBy: collectionData.createdBy ?? null,
          collectionCode: collectionData.code,
          collectionUri: collectionData.uri,
        },
        requireAuthenticated: true,
      },
    };
  }
);
