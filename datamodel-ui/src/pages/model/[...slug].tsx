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
  ViewList,
  ViewListItem,
  getModel,
  getRunningQueriesThunk,
  selectFullScreen,
  setDisplayLang,
  setSelected,
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
import { ModelType } from '@app/common/interfaces/model.interface';
import { compareLocales } from '@app/common/utils/compare-locals';
import { useSelector } from 'react-redux';
import { setNotification } from '@app/common/components/notifications/notifications.slice';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  modelId: string;
}

export default function ModelPage(props: IndexPageProps) {
  const { data } = useGetModelQuery(props.modelId);
  const fullScreen = useSelector(selectFullScreen());

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
        fullScreenElements={<ModelHeader modelInfo={data} />}
        headerHidden={fullScreen}
      >
        <PageHead baseUrl="https://tietomallit.suomi.fi" />

        <Model modelId={props.modelId} fullScreen={fullScreen} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, locale, res }) => {
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
    store.dispatch(
      queryInternalResources.initiate({
        query: '',
        limitToDataModel: modelId,
        pageSize: 20,
        pageFrom: 0,
        resourceTypes: [],
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

    const model = store.getState().modelApi.queries[`getModel("${modelId}")`]
      ?.data as ModelType | undefined | null;

    if (query.lang) {
      store.dispatch(
        setDisplayLang(Array.isArray(query.lang) ? query.lang[0] : query.lang)
      );
    } else if (model?.languages && !model.languages.includes(locale ?? 'fi')) {
      store.dispatch(
        setDisplayLang(
          [...model.languages].sort((a, b) => compareLocales(a, b))[0]
        )
      );
    } else if (locale) {
      store.dispatch(setDisplayLang(locale));
    } else {
      store.dispatch(setDisplayLang('fi'));
    }

    store.dispatch(
      setView(
        query.slug[1] ? (query.slug[1] as keyof ViewList) : 'info',
        ['classes', 'attributes', 'associations'].includes(query.slug[1])
          ? query.slug[2]
            ? (query.slug[2] as keyof ViewListItem)
            : 'list'
          : undefined
      )
    );

    if (query.slug.length >= 3) {
      const resourceType = query.slug[1];
      const resourceId = query.slug[2];

      const modelType = model?.type;

      if (resourceType === 'class') {
        store.dispatch(setView('classes', 'info'));
        store.dispatch(
          getClass.initiate({
            modelId: modelId,
            classId: resourceId,
            applicationProfile: modelType === 'PROFILE' ?? false,
          })
        );
        store.dispatch(setSelected(resourceId, 'classes', modelId));

        await Promise.all(store.dispatch(getClassRunningQueriesThunk()));
      }

      if (['association', 'attribute'].includes(resourceType)) {
        const view =
          resourceType === 'association' ? 'associations' : 'attributes';

        let resourceModelId = modelId;
        let identifier = resourceId;

        const resourceParts = resourceId.split(':');
        if (resourceParts.length === 2) {
          resourceModelId = resourceParts[0];
          identifier = resourceParts[1];
        }
        store.dispatch(setView(view, 'info'));
        store.dispatch(setSelected(identifier, view, resourceModelId));

        store.dispatch(
          getResource.initiate({
            modelId: resourceModelId,
            resourceIdentifier: identifier,
            applicationProfile: modelType === 'PROFILE',
          })
        );

        await Promise.all(store.dispatch(getResourceRunningQueriesThunk()));
      }
    }

    if (query.lang) {
      store.dispatch(setDisplayLang(query.lang as string));
    }

    if (query.new) {
      store.dispatch(setNotification('MODEL_ADD'));
    }

    return {
      props: {
        modelId: modelId,
      },
    };
  }
);
