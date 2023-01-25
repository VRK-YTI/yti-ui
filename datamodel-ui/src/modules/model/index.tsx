import Drawer from '@app/common/components/model-drawer';
import { MainTitle, BadgeBar, Badge } from 'yti-common-ui/title-block';
import { ContentWrapper, ModelFlow, TitleWrapper } from './model.styles';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import { Icon } from 'suomifi-ui-components';
import { MiniMap, Panel } from 'reactflow';
import ModelInfoView from './model-info-view';
import SearchView from './search-view';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useGetModelQuery } from '@app/common/components/model/model.slice';
import { useTranslation } from 'next-i18next';
import {
  getBaseModelPrefix,
  getStatus,
  getTitle,
  getType,
} from '@app/common/utils/get-value';
import {
  translateModelType,
  translateStatus,
} from '@app/common/utils/translation-helpers';

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

  // return (
  //   <div style={{height: '100vh', width: '100vw'}}>
  //   <ModelFlow
  //     nodes={[
  //       {
  //         id: '1',
  //         position: { x: 300, y: 300 },
  //         data: { label: '1' },
  //         style: {
  //           border: '1px solid black',
  //           width: 'min-content',
  //           padding: '5px',
  //         },
  //       },
  //       {
  //         id: '2',
  //         position: { x: 400, y: 300 },
  //         data: { label: '2' },
  //         style: {
  //           border: '1px solid black',
  //           width: 'min-content',
  //           padding: '5px',
  //         },
  //       },
  //       {
  //         id: '3',
  //         position: { x: 500, y: 300 },
  //         data: { label: '3' },
  //         style: {
  //           border: '1px solid black',
  //           width: 'min-content',
  //           padding: '5px',
  //         },
  //       },
  //       {
  //         id: '4',
  //         position: { x: 600, y: 300 },
  //         data: { label: '4' },
  //         style: {
  //           border: '1px solid black',
  //           width: 'min-content',
  //           padding: '5px',
  //         },
  //       },
  //     ]}
  //   >
  //     <MiniMap />
  //   </ModelFlow>
  //   </div>
  // );

  return (
    <div
      style={{
        maxHeight: '100vh',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TitleWrapper>
        <Breadcrumb baseUrl={t('datamodel-title')}>
          <BreadcrumbLink current={true} url="">
            {model.title}
          </BreadcrumbLink>
        </Breadcrumb>
        <MainTitle>{model.title}</MainTitle>
        <BadgeBar larger={true}>
          <>
            <Icon icon="applicationProfile" color="hsl(212, 63%, 49%)" />{' '}
            {translateModelType(getType(modelInfo), t)}
          </>
          <>{getBaseModelPrefix(modelInfo)}</>
          <Badge $isValid={model.status === 'VALID'}>
            {translateStatus(model.status, t)}
          </Badge>
        </BadgeBar>
      </TitleWrapper>

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
                id: 'graph',
                icon: 'calendar',
                buttonLabel: 'Kaavio',
                component: <></>,
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
                icon: 'heart',
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
