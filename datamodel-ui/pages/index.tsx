import { CommonContextProvider, CommonContextState } from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import { SSRConfig } from 'next-i18next';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function IndexPage(props: IndexPageProps) {

  return (
    <CommonContextProvider value={props}>
      <Layout>Placeholder</Layout>
    </CommonContextProvider>
  );
};

