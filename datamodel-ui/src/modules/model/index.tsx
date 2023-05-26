import Drawer from '@app/common/components/model-drawer';
import { ContentWrapper } from './model.styles';
import ModelInfoView from './model-info-view';
import SearchView from './search-view';
import ClassView from '../class-view/class-view';
import AttributeView from '../attribute-view';
import AssociationView from '../association-view';
import { useTranslation } from 'next-i18next';
import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useMemo } from 'react';
import Graph from '../graph';
import LinkedDataView from '../linked-data-view';
import { compareLocales } from '@app/common/utils/compare-locals';

interface ModelProps {
  modelId: string;
}

export default function Model({ modelId }: ModelProps) {
  const { t } = useTranslation('common');
  const { data: modelInfo } = useGetModelQuery(modelId);

  const languages: string[] = useMemo(() => {
    if (!modelInfo) {
      return [];
    }

    return [...modelInfo.languages].sort((a, b) => compareLocales(a, b));
  }, [modelInfo]);

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
          <Drawer
            views={[
              {
                id: 'search',
                icon: 'search',
                buttonLabel: t('search-variant'),
                component: <SearchView modelId={modelId} />,
              },
              {
                id: 'graph',
                icon: 'applicationProfile',
                buttonLabel: t('graph'),
              },
              {
                id: 'info',
                icon: 'info',
                buttonLabel: t('details'),
                component: <ModelInfoView />,
              },
              {
                id: 'links',
                icon: 'attachment',
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
                icon: 'chatHeart',
                buttonLabel: t('classes'),
                component: (
                  <ClassView
                    modelId={modelId}
                    languages={languages}
                    applicationProfile={modelInfo?.type === 'PROFILE'}
                    terminologies={
                      modelInfo?.terminologies.map((t) => t.uri) ?? []
                    }
                  />
                ),
              },
              {
                id: 'attributes',
                icon: 'history',
                buttonLabel: t('attributes'),
                buttonLabelSm: t('attributes-abbreviation'),
                component: (
                  <AttributeView
                    modelId={modelId}
                    languages={languages}
                    terminologies={
                      modelInfo?.terminologies.map((t) => t.uri) ?? []
                    }
                  />
                ),
              },
              {
                id: 'associations',
                icon: 'swapVertical',
                buttonLabel: t('associations'),
                buttonLabelSm: t('associations-abbreviation'),
                component: (
                  <AssociationView
                    modelId={modelId}
                    languages={languages}
                    terminologies={
                      modelInfo?.terminologies.map((t) => t.uri) ?? []
                    }
                  />
                ),
              },
            ]}
          />
        </Graph>
      </ContentWrapper>
    </div>
  );
}
