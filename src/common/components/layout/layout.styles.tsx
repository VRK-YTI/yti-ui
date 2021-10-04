// shared layout helper

import styled from 'styled-components';
import { Heading } from 'suomifi-ui-components';
import { DebugProps } from '../../interfaces/debug-props';

export const WidthContainer = styled.div<DebugProps>`
  width: 1200px;
`;

// main layout

export const SiteContainer = styled.div<DebugProps>`
  height: 100%;
`;

export const SiteWrapper = styled.div<DebugProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  ${(props) => (props.debug === true ? 'border 4px solid green' : '')}
`;

// header layout

export const HeaderContainer = styled.div<DebugProps>``;

export const HeaderWrapper = styled.div<DebugProps>`
  display: flex;
  height: 76px;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  ${(props) => (props.debug === true ? 'border 2px dashed red' : '')}
`;

export const SiteLogo = styled.div<DebugProps>`
  font-weight: bold;
  ${(props) => (props.debug === true ? 'border: 4px solid red' : '')};
`;

export const HeaderTitle = styled(({ children }) => (
  <Heading variant="h1hero">{ children }</Heading>)
)`
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  &:hover {
    color: red;
  }
`;

export const HamburgerMenu = styled.div<DebugProps>``;

// content layout

export const ContentContainer = styled.div<DebugProps>`
  flex-grow: 1;
`;

/*
const SiteHeader = styled.header<DebugProps>`
  width: auto;
  ${ props => props.debug === true ? 'border: 4px solid yellow' : ''};
`;
 */
