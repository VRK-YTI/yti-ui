// shared layout helper

import styled from 'styled-components';
import { DebugProps } from '../../interfaces/debug-props';
import { LayoutProps } from './layout-props';

export const MarginContainer = styled.div<LayoutProps>`
  margin: ${props => props.isLarge ? "0px 50px 10px 50px" : "0px 15px 0px 15px"};
`;

// main layout

export const SiteContainer = styled.div<LayoutProps>`
  width: ${props => props.isLarge ? "80%" : "100%"};
  margin: auto;
  height: 100%;
  border-top: ${(props) => `2px solid ${props.theme.suomifi.colors.highlightBase}`};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  border-left:  ${(props) => `2px solid ${props.theme.suomifi.colors.depthLight2}`}
`;

// header layout

export const HeaderContainer = styled.div<DebugProps>`
  background-color: white;
  height: 76px;
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight3}`};
`;

export const NavigationContainer = styled.div<LayoutProps>`
  background-color: white;
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight3}`};
  display: ${props => props.isLarge ? 'block' : 'none'}
`;

// content layout

export const ContentContainer = styled.div<DebugProps>`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
  flex-grow: 1;
`;

export const FooterContainer = styled.div`
  background-color: white;
`