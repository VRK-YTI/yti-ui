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
import { ModelType } from '@app/common/interfaces/model.interface';
import {
  getServiceCategories,
  getRunningQueriesThunk as getServiceQueriesThunk,
} from '@app/common/components/service-categories/service-categories.slice';
import {
  getOrganizations,
  getRunningQueriesThunk as getOrgQueriesThunk,
} from '@app/common/components/organizations/organizations.slice';

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
    store.dispatch(getServiceCategories.initiate(locale ?? 'fi'));
    store.dispatch(getOrganizations.initiate(locale ?? 'fi'));

    await Promise.all(store.dispatch(getRunningQueriesThunk()));
    await Promise.all(store.dispatch(getServiceQueriesThunk()));
    await Promise.all(store.dispatch(getOrgQueriesThunk()));

    const modelInfo = getStoreData({
      functionKey: `getModel("${modelId}")`,
      reduxKey: 'model',
      state: store.getState(),
    });

    return {
      props: {
        modelInfo: modelInfo,
      },
    };
  }
);
