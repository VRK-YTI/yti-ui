import SideNavigation from '@app/common/components/model-side-navigation';
import { MainTitle, BadgeBar, Badge } from 'yti-common-ui/title-block';
import { ContentWrapper, TitleWrapper } from './model.styles';
import { Breadcrumb, BreadcrumbLink } from 'yti-common-ui/breadcrumb';
import { Icon } from 'suomifi-ui-components';
import { Panel, ReactFlow } from 'reactflow';

export default function Model() {
  return (
    <>
      <TitleWrapper>
        <Breadcrumb>
          <BreadcrumbLink current={true} url="">
            Malli
          </BreadcrumbLink>
        </Breadcrumb>
        <MainTitle>Mallin nimi</MainTitle>
        <BadgeBar larger={true}>
          <>
            <Icon icon="applicationProfile" color="hsl(212, 63%, 49%)" /> Mallin
            nimi
          </>
          <>Mallin tunnus</>
          <Badge>Luonnos</Badge>
        </BadgeBar>
      </TitleWrapper>

      <ContentWrapper>
        <ReactFlow
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
          <Panel position="top-left">
            <SideNavigation />
          </Panel>
        </ReactFlow>
      </ContentWrapper>
    </>
  );
}
