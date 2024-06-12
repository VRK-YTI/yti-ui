// shared layout helper

import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';

export const MarginContainer = styled.div<{
  $breakpoint: Breakpoint;
}>`
  &&.hidden {
    visibility: hidden;
  }
  margin: auto;
  padding-right: 1rem;
  padding-left: 1rem;
`;

// main layout

export const SiteContainer = styled.div`
  width: 100%;
  margin: auto;
  height: 100vh;
`;

export const NavigationContainer = styled.div<{ $breakpoint: Breakpoint }>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: ${(props) => small(props.$breakpoint, '0px', '1px')} solid
    ${(props) => props.theme.suomifi.colors.depthLight1};
`;

// content layout

export const ContentContainer = styled.div<{ $fullScreen?: boolean }>`
  margin-left: 10px;
  background-color: ${(props) =>
    props.$fullScreen
      ? props.theme.suomifi.colors.whiteBase
      : props.theme.suomifi.colors.depthLight3};

  /*  border-bottom: ${(props) =>
    !props.$fullScreen &&
    `1px solid ${props.theme.suomifi.colors.depthLight1}`};*/
  flex-grow: 1;

  ${(props) =>
    props.$fullScreen &&
    `
    display: flex;
    flex-direction: column;
  `}
`;
