import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import { SSRConfig } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import PageHead from 'yti-common-ui/page-head';
import Model from '@app/modules/model';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function ModelPage(props: IndexPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout fullWidth={true}>
        <PageHead baseUrl="https://tietomallit.suomi.fi" />

        <Model />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(async () => {
  return {};
});
