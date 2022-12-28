import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
import Layout from 'yti-common-ui/layout/layout';
import { SSRConfig } from 'next-i18next';
import { createCommonGetServerSideProps } from '@app/common/utils/create-getserversideprops';
import PageHead from 'yti-common-ui/page-head';
import {
  getModel,
  getRunningQueriesThunk,
} from '@app/common/components/model/model.slice';
import ModelModule from '@app/modules/model';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  modelId: string;
}

export default function IndexPage(props: IndexPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
      >
        <PageHead baseUrl="https://tietomallit.suomi.fi" />

        <ModelModule modelId={props.modelId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, params }) => {
    if (!params) {
      throw new Error('Missing parameters for page');
    }

    const id = Array.isArray(params.modelId)
      ? params.modelId[0]
      : params.modelId;

    if (typeof id === 'undefined') {
      throw new Error('Invalid parameter for page');
    }

    store.dispatch(getModel.initiate(id));

    await Promise.all(store.dispatch(getRunningQueriesThunk()));

    return {
      props: {
        modelId: id,
      },
    };
  }
);
