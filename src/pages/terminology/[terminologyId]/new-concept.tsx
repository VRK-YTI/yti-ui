import Layout from '@app/layouts/layout';
import { SSRConfig } from 'next-i18next';
import { default as NewConceptModule } from '@app/modules/new-concept';
import { useRouter } from 'next/router';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import {
  CommonContextInterface,
  CommonContextProvider,
} from '@app/common/components/common-context-provider';

interface NewConceptPageProps extends CommonContextInterface {
  _netI18Next: SSRConfig;
}

export default function NewConcept(props: NewConceptPageProps) {
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
        <NewConceptModule
          terminologyId={terminologyId}
          conceptNames={conceptNames}
        />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
