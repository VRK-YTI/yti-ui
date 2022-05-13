import Layout from '@app/layouts/layout';
import { SSRConfig, useTranslation } from 'next-i18next';
import { default as NewConceptModule } from '@app/modules/new-concept';
import { useRouter } from 'next/router';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import {
  CommonContextState,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';
import PageTitle from '@app/common/components/page-title';

interface NewConceptPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function NewConcept(props: NewConceptPageProps) {
  const { t } = useTranslation('admin');
  const { query } = useRouter();
  const conceptNames = {
    fi: query.fi as string,
    sv: query.sv as string,
    en: query.en as string,
  };
  const terminologyId = (query?.terminologyId ?? '') as string;

  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageTitle title={t('new-concept-title')} siteTitle="Yhteentoimivuusalusta" />

        <NewConceptModule
          terminologyId={terminologyId}
          conceptNames={conceptNames}
        />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
