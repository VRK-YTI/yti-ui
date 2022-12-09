import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import { SSRConfig } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import PageHead from 'yti-common-ui/page-head';
import Profile from '@app/modules/profile';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function IndexPage(props: IndexPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout>
        <PageHead baseUrl="https://tietomallit.suomi.fi" />

        <Profile />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(async () => {
  return {};
});
