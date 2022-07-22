import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { default as NewCollectionModule } from '@app/modules/new-collection';
import { useRouter } from 'next/router';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';
import PageHead from '@app/common/components/page-head';

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

export const getServerSideProps = createCommonGetServerSideProps();
