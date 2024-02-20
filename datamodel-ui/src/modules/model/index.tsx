import Drawer, { ViewType } from '@app/common/components/model-drawer';
import { ContentWrapper } from './model.styles';
import ModelInfoView from './model-info-view';
import SearchView from './search-view';
import ClassView from '../class-view';
import { useTranslation } from 'next-i18next';
import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useEffect, useMemo } from 'react';
import Graph from '../graph';
import LinkedDataView from '../linked-data-view';
import { compareLocales } from '@app/common/utils/compare-locals';
import Documentation from '../documentation';
import {
  IconApplicationProfile,
  IconInfo,
  IconLink,
  IconRows,
  IconSearch,
  IconSwapVertical,
  IconWindow,
  IconRegisters,
} from 'suomifi-ui-components';
import ResourceView from '../resource';
import { ResourceType } from '@app/common/interfaces/resource-type.interface';
import ModelTools from '@app/common/components/model-tools';
import { translateDrawerButton } from '@app/common/utils/translation-helpers';
import Notification from '../notification';
import { useRouter } from 'next/router';
import { useStoreDispatch } from '@app/store';
import { setNotification } from '@app/common/components/notifications/notifications.slice';
import { getSlugAsString } from '@app/common/utils/parse-slug';

interface ModelProps {
  modelId: string;
  fullScreen?: boolean;
}

export default function Model({ modelId, fullScreen }: ModelProps) {
  const { t } = useTranslation('common');
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const version = useMemo(
    () => getSlugAsString(router.query.ver),
    [router.query.ver]
  );
  const { data: modelInfo } = useGetModelQuery({
    modelId: modelId,
    version: version,
  });

  const organizationIds = useMemo(() => {
    if (!modelInfo) {
      return [];
    }

    return modelInfo.organizations.map((o) => o.id);
  }, [modelInfo]);

  const languages: string[] = useMemo(() => {
    if (!modelInfo) {
      return [];
    }

    return [...modelInfo.languages].sort((a, b) => compareLocales(a, b));
  }, [modelInfo]);

  const views: ViewType[] = useMemo(() => {
    if (!modelInfo) {
      return [];
    }
    return [
      {
        id: 'search',
        icon: <IconSearch />,
        buttonLabel: t('search-variant'),
        component: <SearchView modelId={modelId} version={version} />,
      },
      {
        id: 'graph',
        icon: <IconApplicationProfile />,
        buttonLabel: t('graph'),
        component: (
          <Graph
            modelId={modelId}
            version={version}
            applicationProfile={modelInfo?.type === 'PROFILE'}
            organizationIds={organizationIds}
          >
            <ModelTools
              modelId={modelId}
              applicationProfile={modelInfo?.type === 'PROFILE'}
              organisations={organizationIds}
            />
          </Graph>
        ),
      },
      {
        id: 'info',
        icon: <IconInfo />,
        buttonLabel: t('details'),
        component: <ModelInfoView organizationIds={organizationIds} />,
      },
      {
        id: 'links',
        icon: <IconLink />,
        buttonLabel: t('links'),
        component: (
          <LinkedDataView
            modelId={modelId}
            version={version}
            isApplicationProfile={modelInfo?.type === 'PROFILE'}
            organizationIds={organizationIds}
          />
        ),
      },
      {
        id: 'classes',
        icon: <IconWindow />,
        buttonLabel: translateDrawerButton(
          'classes',
          modelInfo?.type === 'PROFILE',
          t
        ),
        component: (
          <ClassView
            modelId={modelId}
            version={version}
            languages={languages}
            applicationProfile={modelInfo?.type === 'PROFILE'}
            terminologies={modelInfo?.terminologies.map((t) => t.uri) ?? []}
            organizationIds={organizationIds}
          />
        ),
      },
      {
        id: 'attributes',
        icon: <IconRows />,
        buttonLabel: translateDrawerButton(
          'attributes',
          modelInfo?.type === 'PROFILE',
          t
        ),
        buttonLabelSm: t('attributes-abbreviation'),
        component: (
          <ResourceView
            modelId={modelId}
            version={version}
            type={ResourceType.ATTRIBUTE}
            languages={languages}
            applicationProfile={modelInfo?.type === 'PROFILE'}
            terminologies={modelInfo?.terminologies.map((t) => t.uri) ?? []}
            organizationIds={organizationIds}
          />
        ),
      },
      {
        id: 'associations',
        icon: <IconSwapVertical />,
        buttonLabel: translateDrawerButton(
          'associations',
          modelInfo?.type === 'PROFILE',
          t
        ),
        buttonLabelSm: t('associations-abbreviation'),
        component: (
          <ResourceView
            modelId={modelId}
            version={version}
            type={ResourceType.ASSOCIATION}
            languages={languages}
            applicationProfile={modelInfo?.type === 'PROFILE'}
            terminologies={modelInfo?.terminologies.map((t) => t.uri) ?? []}
            organizationIds={organizationIds}
          />
        ),
      },
      {
        id: 'documentation',
        icon: <IconRegisters />,
        buttonLabel: t('documentation-fitted', { ns: 'admin' }),
        component: (
          <Documentation
            modelId={modelId}
            version={version}
            languages={languages}
            organizationIds={organizationIds}
          />
        ),
      },
    ] as ViewType[];
  }, [languages, modelId, version, modelInfo, organizationIds, t]);

  useEffect(() => {
    if (router.query.new) {
      dispatch(setNotification('MODEL_ADD'));
      router.replace(`/model/${modelId}`, undefined, { shallow: true });
    }
  }, [router, dispatch, modelId]);

  return (
    <div
      style={{
        height: fullScreen ? '100vh' : 0,
        flex: '1 1 auto',
      }}
    >
      <Notification applicationProfile={modelInfo?.type === 'PROFILE'} />

      <ContentWrapper>
        <Graph
          modelId={modelId}
          version={version}
          applicationProfile={modelInfo?.type === 'PROFILE'}
          organizationIds={organizationIds}
          drawer={<Drawer views={views} />}
        >
          <ModelTools
            modelId={modelId}
            applicationProfile={modelInfo?.type === 'PROFILE'}
            organisations={organizationIds}
          />
        </Graph>
      </ContentWrapper>
    </div>
  );
}
