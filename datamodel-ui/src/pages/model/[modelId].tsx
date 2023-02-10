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
  useGetModelQuery,
} from '@app/common/components/model/model.slice';
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
  modelId: string;
}

export default function ModelPage(props: IndexPageProps) {
  const { data } = useGetModelQuery(props.modelId);

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
        fullScreenElements={<ModelHeader modelInfo={data} />}
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

    return {
      props: {
        modelId: modelId,
      },
    };
  }
);
