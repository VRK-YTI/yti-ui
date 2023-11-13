import Layout from '@app/common/components/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import EditCollection from '@app/modules/edit-collection';
import { useRouter } from 'next/router';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import {
  CommonContextState,
  CommonContextProvider,
} from 'yti-common-ui/common-context-provider';
import PageHead from 'yti-common-ui/page-head';
import {
  getVocabulary,
  getRunningQueriesThunk,
} from '@app/common/components/vocabulary/vocabulary.slice';
import { wrapper } from '@app/store';

interface NewCollectionPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function NewConcept(props: NewCollectionPageProps) {
  wrapper.useHydration(props);
  const { t } = useTranslation('admin');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
          title={t('new-collection')}
          siteTitle="Yhteentoimivuusalusta"
        />

        <EditCollection
          terminologyId={terminologyId}
          collectionName={t('new-collection')}
        />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query }: LocalHandlerParams) => {
    const terminologyId = Array.isArray(query.terminologyId)
      ? query.terminologyId[0]
      : query.terminologyId;

    if (terminologyId === undefined) {
      throw new Error('Invalid parameter for page');
    }

    store.dispatch(getVocabulary.initiate({ id: terminologyId }));

    await Promise.all(store.dispatch(getRunningQueriesThunk()));

    return {
      props: {
        requireAuthenticated: true,
      },
    };
  }
);
