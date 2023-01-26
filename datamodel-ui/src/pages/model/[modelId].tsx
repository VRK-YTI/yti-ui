import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import { SSRConfig } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import PageHead from 'yti-common-ui/page-head';
import Model from '@app/modules/model';
import ModelHeader from '@app/modules/model/model-header';
import { useGetModelQuery } from '@app/common/components/model/model.slice';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
}

export default function ModelPage(props: IndexPageProps) {
  const { data: modelInfo } = useGetModelQuery('fully');

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
        fullScreenElements={<ModelHeader modelInfo={modelInfo} />}
      >
        <PageHead baseUrl="https://tietomallit.suomi.fi" />

        <Model />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(async () => {
  return {};
});
