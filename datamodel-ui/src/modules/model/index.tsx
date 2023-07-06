import Drawer, { ViewType } from '@app/common/components/model-drawer';
import { ContentWrapper } from './model.styles';
import ModelInfoView from './model-info-view';
import SearchView from './search-view';
import ClassView from '../class-view';
import { useTranslation } from 'next-i18next';
import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useMemo } from 'react';
import Graph from '../graph';
import LinkedDataView from '../linked-data-view';
import { compareLocales } from '@app/common/utils/compare-locals';
import Documentation from '../documentation';
import HasPermission from '@app/common/utils/has-permission';
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

interface ModelProps {
  modelId: string;
}

export default function Model({ modelId }: ModelProps) {
  const { t } = useTranslation('common');
  const hasPermission = HasPermission({
    actions: 'ADMIN_DATA_MODEL',
  });
  const { data: modelInfo } = useGetModelQuery(modelId);

  const languages: string[] = useMemo(() => {
    if (!modelInfo) {
      return [];
    }

    return [...modelInfo.languages].sort((a, b) => compareLocales(a, b));
  }, [modelInfo]);

  const views: ViewType[] = useMemo(() => {
    const v = [
      {
        id: 'search',
        icon: <IconSearch />,
        buttonLabel: t('search-variant'),
        component: <SearchView modelId={modelId} />,
      },
      {
        id: 'graph',
        icon: <IconApplicationProfile />,
        buttonLabel: t('graph'),
      },
      {
        id: 'info',
        icon: <IconInfo />,
        buttonLabel: t('details'),
        component: <ModelInfoView />,
      },
      {
        id: 'links',
        icon: <IconLink />,
        buttonLabel: t('links'),
        component: (
          <LinkedDataView
            modelId={modelId}
            isApplicationProfile={modelInfo?.type === 'PROFILE'}
          />
        ),
      },
      {
        id: 'classes',
        icon: <IconWindow />,
        buttonLabel: t('classes'),
        component: (
          <ClassView
            modelId={modelId}
            languages={languages}
            applicationProfile={modelInfo?.type === 'PROFILE'}
            terminologies={modelInfo?.terminologies.map((t) => t.uri) ?? []}
          />
        ),
      },
      {
        id: 'attributes',
        icon: <IconRows />,
        buttonLabel: t('attributes'),
        buttonLabelSm: t('attributes-abbreviation'),
        component: (
          <ResourceView
            modelId={modelId}
            type={ResourceType.ATTRIBUTE}
            languages={languages}
            applicationProfile={modelInfo?.type === 'PROFILE'}
            terminologies={modelInfo?.terminologies.map((t) => t.uri) ?? []}
          />
        ),
      },
      {
        id: 'associations',
        icon: <IconSwapVertical />,
        buttonLabel: t('associations'),
        buttonLabelSm: t('associations-abbreviation'),
        component: (
          <ResourceView
            modelId={modelId}
            type={ResourceType.ASSOCIATION}
            languages={languages}
            applicationProfile={modelInfo?.type === 'PROFILE'}
            terminologies={modelInfo?.terminologies.map((t) => t.uri) ?? []}
          />
        ),
      },
    ];

    if (hasPermission) {
      return [
        ...v,
        {
          id: 'documentation',
          icon: <IconRegisters />,
          buttonLabel: t('documentation-fitted', { ns: 'admin' }),
          component: <Documentation modelId={modelId} languages={languages} />,
        },
      ] as ViewType[];
    }

    return v as ViewType[];
  }, [hasPermission, languages, modelId, modelInfo, t]);

  return (
    <div
      style={{
        height: 0,
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ContentWrapper>
        <Graph modelId={modelId}>
          <Drawer views={views} />
          <ModelTools />
        </Graph>
      </ContentWrapper>
    </div>
  );
}
