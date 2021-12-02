// shared layout helper

import styled from 'styled-components';
import { DebugProps } from '../common/interfaces/debug-props';
import { LayoutProps } from './layout-props';

export const MarginContainer = styled.div<LayoutProps>`
  max-width: 1100px;
  margin: auto;
  padding: ${props => props.isSmall ? '0 15px' : 'auto'};
`;

// main layout

export const SiteContainer = styled.div<LayoutProps>`
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
`;

// header layout

export const HeaderContainer = styled.div<LayoutProps>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  border-top: ${(props) => `3px solid ${props.theme.suomifi.colors.brandBase}`};
`;

export const NavigationContainer = styled.div<LayoutProps>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: ${props => props.isSmall ? '0px' : '1px'} solid ${(props) => props.theme.suomifi.colors.depthLight1};
`;

// content layout

export const ContentContainer = styled.div<DebugProps>`
  background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  flex-grow: 1;
`;

export const FooterContainer = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
`;
