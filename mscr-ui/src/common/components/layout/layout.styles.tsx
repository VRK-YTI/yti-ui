// shared layout helper

import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { resolve, small } from 'yti-common-ui/media-query/styled-helpers';

export const MarginContainer = styled.div<{
  $breakpoint: Breakpoint;
}>`
  max-width: 96%;
  margin: auto;
  padding: ${(props) => resolve(props.$breakpoint, '0 15px', '0 30px', 'auto')};
  min-width: 300px;
`;

// main layout

export const SiteContainer = styled.div`
  width: 100%;
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

// header layout

export const HeaderContainer = styled.div<{ $noBorder?: boolean }>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  ${(props) =>
    !props.$noBorder &&
    `
  border-bottom: 1px solid ${props.theme.suomifi.colors.depthLight1};
  border-top: 3px solid ${props.theme.suomifi.colors.brandBase};
  `}
`;

export const NavigationContainer = styled.div<{ $breakpoint: Breakpoint }>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: ${(props) => small(props.$breakpoint, '0px', '1px')} solid
    ${(props) => props.theme.suomifi.colors.depthLight1};
`;

// content layout

export const ContentContainer = styled.div<{
  $fullScreen?: boolean;
  $breakpoint?: Breakpoint;
}>`
  border-bottom: ${(props) =>
    !props.$fullScreen &&
    `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  flex-grow: 1;
  // Sync the left margin with the navigation bar width + padding
  ${(props) =>
    props.$breakpoint &&
    `
    margin-left: ${small(props.$breakpoint, '25%', '200px')}
  `}
  ${(props) =>
    props.$fullScreen &&
    `
    display: flex;
    flex-direction: column;
  `}
`;

export const FooterContainer = styled.footer`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
`;
