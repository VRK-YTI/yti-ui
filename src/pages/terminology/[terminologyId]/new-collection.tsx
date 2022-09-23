import Layout from '@app/layouts/layout';
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
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';
import {
  getVocabulary,
  getRunningOperationPromises,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  getAuthenticatedUser,
  getRunningOperationPromises as authenticatedUserGetRunningOperationPromises,
} from '@app/common/components/login/login.slice';
import { ssrHasPermission } from '@app/common/utils/ssr-permission-check';

interface NewCollectionPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function NewConcept(props: NewCollectionPageProps) {
  const { t } = useTranslation('admin');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageHead
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
    store.dispatch(getAuthenticatedUser.initiate());

    await Promise.all(getRunningOperationPromises());
    await Promise.all(authenticatedUserGetRunningOperationPromises());

    if (!ssrHasPermission(store.getState(), ['CREATE_COLLECTION'])) {
      return {
        redirect: {
          destination: '/401',
          permanent: false,
        },
      };
    }

    return {};
  }
);
