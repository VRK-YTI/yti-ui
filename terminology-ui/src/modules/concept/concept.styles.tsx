import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';
import { Block, ExpanderGroup } from 'suomifi-ui-components';

export const PageContent = styled.div<{ $breakpoint: Breakpoint }>`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  background-color: white;
  display: flex;
  flex-direction: ${(props) => small(props.$breakpoint, 'column', 'row')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xxxxl};
`;

export const MainContent = styled.main`
  flex-grow: 1;
  padding: ${(props) => props.theme.suomifi.spacing.m};
  padding-bottom: 40px;
  max-width: 100%;
`;

export const PropertyList = styled.ul<{ $smBot?: boolean }>`
  list-style: none;
  padding: 0px;
  margin-top: 0px;
  margin-bottom: ${(props) =>
    props.$smBot ? '0px' : props.theme.suomifi.spacing.m};
  font-size: 16px;

  li {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
  }
`;

export const EditToolsBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.s};

  > button {
    width: max-content;
  }
`;

export const DetailsExpanderGroup = styled(ExpanderGroup)`
  margin-top: ${(props) => props.theme.suomifi.spacing.s};
`;
