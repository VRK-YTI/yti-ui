import {
  getCollection,
  getRunningQueriesThunk as getCollectionRunningQueriesThunk,
} from '@app/common/components/collection/collection.slice';
import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';
import { getStoreData } from '@app/common/utils/get-store-data';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import {
  getVocabulary,
  getRunningQueriesThunk,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Layout from '@app/common/components/layout';
import EditCollection from '@app/modules/edit-collection';
import { SSRConfig } from 'next-i18next';
import { wrapper } from '@app/store';

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
  wrapper.useHydration(props);

  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
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
    await Promise.all(store.dispatch(getCollectionRunningQueriesThunk()));
    await Promise.all(store.dispatch(getRunningQueriesThunk()));

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
