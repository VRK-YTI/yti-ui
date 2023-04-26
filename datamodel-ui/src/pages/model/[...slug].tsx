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
  setView,
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
import {
  queryInternalResources,
  getRunningQueriesThunk as getInternalResourcesRunningQueriesThunk,
} from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import {
  getVisualization,
  getRunningQueriesThunk as getVisualizationRunningQueriesThunk,
} from '@app/common/components/visualization/visualization.slice';
import { getModelId } from '@app/common/utils/parse-slug';
import {
  getClass,
  getRunningQueriesThunk as getClassRunningQueriesThunk,
} from '@app/common/components/class/class.slice';
import {
  getResource,
  getRunningQueriesThunk as getResourceRunningQueriesThunk,
} from '@app/common/components/resource/resource.slice';

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

        <Model modelId={props.modelId} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, locale }) => {
    if (!query.slug) {
      throw new Error('Missing query for page');
    }

    const modelId = getModelId(query.slug);

    if (!modelId) {
      throw new Error('Missing id for page');
    }

    store.dispatch(getModel.initiate(modelId));
    store.dispatch(getServiceCategories.initiate(locale ?? 'fi'));
    store.dispatch(getOrganizations.initiate(locale ?? 'fi'));
    store.dispatch(
      queryInternalResources.initiate({
        query: '',
        limitToDataModel: modelId,
        pageSize: 20,
        pageFrom: 0,
        resourceTypes: [ResourceType.CLASS],
      })
    );
    store.dispatch(
      queryInternalResources.initiate({
        query: '',
        limitToDataModel: modelId,
        pageSize: 20,
        pageFrom: 0,
        resourceTypes: [ResourceType.ASSOCIATION],
      })
    );
    store.dispatch(
      queryInternalResources.initiate({
        query: '',
        limitToDataModel: modelId,
        pageSize: 20,
        pageFrom: 0,
        resourceTypes: [ResourceType.ATTRIBUTE],
      })
    );
    store.dispatch(getVisualization.initiate(modelId));

    await Promise.all(store.dispatch(getRunningQueriesThunk()));
    await Promise.all(store.dispatch(getServiceQueriesThunk()));
    await Promise.all(store.dispatch(getOrgQueriesThunk()));
    await Promise.all(
      store.dispatch(getInternalResourcesRunningQueriesThunk())
    );
    await Promise.all(store.dispatch(getVisualizationRunningQueriesThunk()));

    if (query.slug.length >= 3) {
      const resourceType = query.slug[1];
      const resourceId = query.slug[2];

      if (resourceType === 'class') {
        store.dispatch(setView('classes', 'info'));
        store.dispatch(
          getClass.initiate({ modelId: modelId, classId: resourceId })
        );

        await Promise.all(store.dispatch(getClassRunningQueriesThunk()));
      }

      if (['association', 'attribute'].includes(resourceType)) {
        store.dispatch(
          setView(
            resourceType === 'association' ? 'associations' : 'attributes',
            'info'
          )
        );
        store.dispatch(
          getResource.initiate({
            modelId: modelId,
            resourceIdentifier: resourceId,
          })
        );

        await Promise.all(store.dispatch(getResourceRunningQueriesThunk()));
      }
    }

    return {
      props: {
        modelId: modelId,
      },
    };
  }
);
