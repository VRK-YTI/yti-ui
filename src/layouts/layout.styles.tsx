// shared layout helper

import styled from 'styled-components';
import { Breakpoint } from '../common/components/media-query/media-query-context';

export const MarginContainer = styled.div<{ breakpoint: Breakpoint }>`
  max-width: 1100px;
  margin: auto;
  padding: ${props => props.breakpoint === 'small' ? '0 15px' : 'auto'};
`;

// main layout

export const SiteContainer = styled.div`
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

// header layout

export const HeaderContainer = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  border-top: ${(props) => `3px solid ${props.theme.suomifi.colors.brandBase}`};
`;

export const NavigationContainer = styled.div<{ breakpoint: Breakpoint }>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: ${props => props.breakpoint === 'small' ? '0px' : '1px'} solid ${(props) => props.theme.suomifi.colors.depthLight1};
`;

// content layout

export const ContentContainer = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  flex-grow: 1;
`;

export const FooterContainer = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
`;
