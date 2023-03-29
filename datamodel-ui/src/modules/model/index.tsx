import Drawer from '@app/common/components/model-drawer';
import { ContentWrapper, ModelFlow } from './model.styles';
import ModelInfoView from './model-info-view';
import SearchView from './search-view';
import ClassView from '../class-view/class-view';
import AttributeView from '../attribute-view';
import AssociationView from '../association-view';
import { useTranslation } from 'next-i18next';
import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useMemo } from 'react';

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

    return modelInfo.languages;
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
        <ModelFlow
          nodes={[
            {
              id: '1',
              position: { x: 300, y: 300 },
              data: { label: '1' },
              style: {
                border: '1px solid black',
                width: 'min-content',
                padding: '5px',
              },
            },
            {
              id: '2',
              position: { x: 400, y: 300 },
              data: { label: '2' },
              style: {
                border: '1px solid black',
                width: 'min-content',
                padding: '5px',
              },
            },
            {
              id: '3',
              position: { x: 500, y: 300 },
              data: { label: '3' },
              style: {
                border: '1px solid black',
                width: 'min-content',
                padding: '5px',
              },
            },
            {
              id: '4',
              position: { x: 600, y: 300 },
              data: { label: '4' },
              style: {
                border: '1px solid black',
                width: 'min-content',
                padding: '5px',
              },
            },
          ]}
        >
          <Drawer
            views={[
              {
                id: 'search',
                icon: 'search',
                buttonLabel: t('search-variant'),
                component: <SearchView />,
              },
              {
                id: 'graph-small',
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
                id: 'link',
                icon: 'attachment',
                buttonLabel: 'Linkitykset',
                component: <></>,
              },
              {
                id: 'classes',
                icon: 'chatHeart',
                buttonLabel: t('classes'),
                component: (
                  <ClassView modelId={modelId} languages={languages} />
                ),
              },
              {
                id: 'attributes',
                icon: 'history',
                buttonLabel: t('attributes'),
                buttonLabelSm: t('attributes-abbreviation'),
                component: (
                  <AttributeView modelId={modelId} languages={languages} />
                ),
              },
              {
                id: 'associations',
                icon: 'swapVertical',
                buttonLabel: t('associations'),
                buttonLabelSm: t('associations-abbreviation'),
                component: (
                  <AssociationView modelId={modelId} languages={languages} />
                ),
              },
            ]}
          />
        </ModelFlow>
      </ContentWrapper>
    </div>
  );
}
