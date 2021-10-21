// shared layout helper

import styled from 'styled-components';
import { Heading } from 'suomifi-ui-components';
import { DebugProps } from '../../interfaces/debug-props';
import { LayoutProps } from './layout-props';

export const MarginContainer = styled.div<DebugProps>`
  margin: 00px 50px 10px 50px;
`;

// main layout

export const SiteContainer = styled.div<DebugProps>`
  width: 80%;
  margin: auto;
  height: 100%;
  border-top: ${(props) => `2px solid ${props.theme.suomifi.colors.highlightBase}`};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  border-left:  ${(props) => `2px solid ${props.theme.suomifi.colors.depthLight2}`}
`;

export const SiteWrapper = styled.div<DebugProps>`
  ${(props) => (props.debug === true ? 'border 4px solid green' : '')}
`;

// header layout

export const HeaderContainer = styled.div<DebugProps>`
  background-color: white;
  height: 76px;
  border-bottom: ${(props) => `1px solid ${props.theme.suomifi.colors.depthLight3}`};
`;

export const HamburgerMenu = styled.div<DebugProps>`

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

/*
const SiteHeader = styled.header<DebugProps>`
  width: auto;
  ${ props => props.debug === true ? 'border: 4px solid yellow' : ''};
`;
 */
