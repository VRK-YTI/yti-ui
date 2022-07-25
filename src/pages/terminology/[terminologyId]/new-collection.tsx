import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { default as NewCollectionModule } from '@app/modules/new-collection';
import { useRouter } from 'next/router';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';
import {
  getVocabulary,
  getRunningOperationPromises,
} from '@app/common/components/vocabulary/vocabulary.slice';

interface NewConceptPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function NewConcept(props: NewConceptPageProps) {
  const { t } = useTranslation('admin');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageHead
          title={t('new-collection-title')}
          siteTitle="Yhteentoimivuusalusta"
        />

        <NewCollectionModule
          terminologyId={terminologyId}
          collectionName={'uusi käsitekokoelma'}
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
    await Promise.all(getRunningOperationPromises());

    return {};
  }
);
