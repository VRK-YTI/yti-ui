import styled from 'styled-components';
import { Breakpoint } from '../../common/components/media-query/media-query-context';
import { small } from '../../common/components/media-query/styled-helpers';

export const PageContent = styled.div<{ breakpoint: Breakpoint }>`
  border: 1px solid ${props => props.theme.suomifi.colors.depthLight1};
  background-color: white;
  display: flex;
  flex-direction: ${props => small(props.breakpoint, 'column', 'row')};
  margin-bottom: ${props => props.theme.suomifi.spacing.xxxxl};
`;

export const MainContent = styled.main`
  flex-grow: 1;
  padding: ${props => props.theme.suomifi.spacing.m};
`;
