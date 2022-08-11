import {
  CommonContextProvider,
  CommonContextState,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';
import {
  getGroups,
  getOrganizations,
  getRunningOperationPromises as getTermSearchRunningOperationPromises,
} from '@app/common/components/terminology-search/terminology-search.slice';
import {
  getVocabulary,
  getRunningOperationPromises,
} from '@app/common/components/vocabulary/vocabulary.slice';
import {
  createCommonGetServerSideProps,
  LocalHandlerParams,
} from '@app/common/utils/create-getserversideprops';
import Layout from '@app/layouts/layout';
import EditVocabulary from '@app/modules/edit-vocabulary';
import { SSRConfig, useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

interface EditTerminologyPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function EditTerminology(props: EditTerminologyPageProps) {
  const { t } = useTranslation('admin');
  const { query } = useRouter();
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageHead
          title={t('edit-terminology')}
          siteTitle="Yhteentoimivuusalusta"
        />

        <EditVocabulary terminologyId={terminologyId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, params, locale }: LocalHandlerParams) => {
    const terminologyId = Array.isArray(params.terminologyId)
      ? params.terminologyId[0]
      : params.terminologyId;

    if (terminologyId === undefined) {
      throw new Error('Invalid parameter for page');
    }

    store.dispatch(getVocabulary.initiate({ id: terminologyId }));
    store.dispatch(getOrganizations.initiate(locale));
    store.dispatch(getGroups.initiate(locale));

    await Promise.all(getRunningOperationPromises());
    await Promise.all(getTermSearchRunningOperationPromises());

    return {};
  }
);
