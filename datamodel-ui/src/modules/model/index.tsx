import Drawer from '@app/common/components/model-drawer';
import { ContentWrapper, ModelFlow } from './model.styles';
import ModelInfoView from './model-info-view';
import SearchView from './search-view';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useTranslation } from 'next-i18next';
import { getStatus, getTitle } from '@app/common/utils/get-value';

export default function Model() {
  const { t, i18n } = useTranslation('common');
  const { query } = useRouter();
  const [modelId] = useState(
    Array.isArray(query.modelId) ? query.modelId[0] : query.modelId ?? ''
  );
  const { data: modelInfo } = useGetModelQuery(modelId);

  const model = useMemo(
    () => ({
      title: getTitle(modelInfo, i18n.language),
      status: getStatus(modelInfo),
    }),
    [modelInfo, i18n.language]
  );

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
                buttonLabel: 'Hae',
                component: <SearchView />,
              },
              {
                id: 'info',
                icon: 'info',
                buttonLabel: 'Tiedot',
                component: <ModelInfoView />,
              },
              {
                id: 'classes',
                icon: 'chatHeart',
                buttonLabel: 'Luokat',
                component: <></>,
              },
              {
                id: 'attributes',
                icon: 'history',
                buttonLabel: 'Attribuutit',
                buttonLabelSm: 'Attr.',
                component: <></>,
              },
              {
                id: 'associations',
                icon: 'swapVertical',
                buttonLabel: 'Assosisaatiot',
                buttonLabelSm: 'Assos.',
                component: <></>,
              },
            ]}
          />
        </ModelFlow>
      </ContentWrapper>
    </div>
  );
}
