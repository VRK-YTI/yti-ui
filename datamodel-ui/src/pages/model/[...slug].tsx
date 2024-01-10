import {
  CommonContextProvider,
  CommonContextState,
} from 'yti-common-ui/common-context-provider';
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
import { getSlugAsString } from '@app/common/utils/parse-slug';
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
import { useRouter } from 'next/router';
import { wrapper } from '@app/store';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import Layout from '@app/common/components/layout';
import {
  getAuthenticatedUser,
  getRunningQueriesThunk as getAuthenticatedUserRunningQueriesThunk,
} from '@app/common/components/login/login.slice';
import { checkPermission } from '@app/common/utils/has-permission';

interface IndexPageProps extends CommonContextState {
  _netI18Next: SSRConfig;
  modelId: string;
  title?: string;
  description?: string;
}

export default function ModelPage(props: IndexPageProps) {
  wrapper.useHydration(props);

  const { query, asPath } = useRouter();
  const version = getSlugAsString(query.ver);
  const { data } = useGetModelQuery({
    modelId: props.modelId,
    version: version,
  });
  const fullScreen = useSelector(selectFullScreen());

  return (
    <CommonContextProvider value={props}>
      <Layout
        user={props.user ?? undefined}
        fakeableUsers={props.fakeableUsers}
        fullScreenElements={<ModelHeader modelInfo={data} />}
        headerHidden={fullScreen}
        langPickerHidden={true}
      >
        <PageHead
          baseUrl="https://tietomallit.suomi.fi"
          title={props.title ?? ''}
          description={props.description ?? ''}
          path={asPath}
        />

        <Model modelId={props.modelId} fullScreen={fullScreen} />
      </Layout>
    </CommonContextProvider>
  );
}

export const getServerSideProps = createCommonGetServerSideProps(
  async ({ store, query, locale }) => {
    if (!query.slug) {
      throw new Error('Missing query for page');
    }

    const modelId = getSlugAsString(query.slug);
    const version = getSlugAsString(query.ver);

    if (!modelId) {
      throw new Error('Missing id for page');
    }

    store.dispatch(getAuthenticatedUser.initiate());
    store.dispatch(getModel.initiate({ modelId: modelId, version: version }));
    store.dispatch(getServiceCategories.initiate(locale ?? 'fi'));
    store.dispatch(getOrganizations.initiate({ sortLang: locale ?? 'fi' }));
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
    store.dispatch(
      getVisualization.initiate({ modelid: modelId, version: version })
    );

    await Promise.all(
      store.dispatch(getAuthenticatedUserRunningQueriesThunk())
    );
    await Promise.all(store.dispatch(getRunningQueriesThunk()));
    await Promise.all(store.dispatch(getServiceQueriesThunk()));
    await Promise.all(store.dispatch(getOrgQueriesThunk()));
    await Promise.all(
      store.dispatch(getInternalResourcesRunningQueriesThunk())
    );
    await Promise.all(store.dispatch(getVisualizationRunningQueriesThunk()));

    const model = store.getState().modelApi.queries[
      `getModel({"modelId":"${modelId}"${
        version ? `,"version":"${version}"` : ''
      }})`
    ]?.data as ModelType | undefined | null;

    if (!model) {
      return {
        redirect: {
          permanent: false,
          destination: '/404',
        },
      };
    }

    const user =
      store.getState().loginApi.queries['getAuthenticatedUser(undefined)']
        ?.data;

    if (
      !model.version &&
      (!user ||
        !checkPermission({
          user: user,
          actions: ['EDIT_DATA_MODEL'],
          targetOrganizations: model.organizations.map((org) => org.id),
        }))
    ) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    if (query.lang) {
      store.dispatch(
        setDisplayLang(Array.isArray(query.lang) ? query.lang[0] : query.lang)
      );
    } else if (model.languages && !model.languages.includes(locale ?? 'fi')) {
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

      const modelType = model.type;

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
        let version;

        const resourceParts = resourceId.split(':');
        if (resourceParts.length === 2) {
          resourceModelId = resourceParts[0];
          identifier = resourceParts[1];
          const ns = model.internalNamespaces.find(
            (ns) => ns.prefix === resourceModelId
          );

          if (ns) {
            const match = ns.namespace.match(/\/(\d\.\d\.\d)\//);
            version = match ? match[1] : undefined;
          }
        }
        store.dispatch(setView(view, 'info'));
        store.dispatch(setSelected(identifier, view, resourceModelId, version));

        store.dispatch(
          getResource.initiate({
            modelId: resourceModelId,
            resourceIdentifier: identifier,
            applicationProfile: modelType === 'PROFILE',
            version,
          })
        );

        await Promise.all(store.dispatch(getResourceRunningQueriesThunk()));
      }
    }

    if (query.lang) {
      store.dispatch(setDisplayLang(query.lang as string));
    }

    const title = getLanguageVersion({
      data: model.label,
      lang: locale ?? 'fi',
    });
    const description = getLanguageVersion({
      data: model.description,
      lang: locale ?? 'fi',
    });

    return {
      props: {
        modelId: modelId,
        title: title,
        description: description,
      },
    };
  }
);
