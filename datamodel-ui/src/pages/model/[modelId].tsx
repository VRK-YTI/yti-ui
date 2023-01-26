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
import {
  getModel,
  getRunningQueriesThunk,
} from '@app/common/components/model/model.slice';
import { getStoreData } from '@app/common/utils/utils';
import { Model as ModelType } from '@app/common/interfaces/model.interface';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  modelInfo?: ModelType;
}

export default function ModelPage(props: IndexPageProps) {
  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
        fullScreenElements={<ModelHeader modelInfo={props.modelInfo} />}
      >
        <PageHead baseUrl="https://tietomallit.suomi.fi" />

        <Model />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, locale }) => {
    if (!query) {
      throw new Error('Missing query for page');
    }

    const modelId = Array.isArray(query.modelId)
      ? query.modelId[0]
      : query.modelId;

    if (!modelId) {
      throw new Error('Missing id for page');
    }

    store.dispatch(getModel.initiate(modelId));

    await Promise.all(store.dispatch(getRunningQueriesThunk()));

    const modelInfo = getStoreData({
      functionKey: `getModel("${modelId}")`,
      reduxKey: 'modelApi',
      state: store.getState(),
    });

    return {
      props: {
        modelInfo: modelInfo,
      },
    };
  }
);
