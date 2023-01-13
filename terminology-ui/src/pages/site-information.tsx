import { SSRConfig } from 'next-i18next';
import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from '@app/common/components/layout';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import PageHead from 'yti-common-ui/page-head';
import SiteInformationModule from '@app/modules/site-information';

interface SiteInformationPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function SiteInformation(props: SiteInformationPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout user={props.user} fakeableUsers={props.fakeableUsers}>
        <PageHead
          baseUrl="https://sanastot.suomi.fi"
          title="Tietoa Sanastot-palvelusta"
          description="Sanastot-palvelun lyhyt kuvaus"
        />

        <SiteInformationModule />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps();
