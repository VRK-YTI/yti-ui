// shared layout helper

import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';

export const MarginContainer = styled.div<{
  $breakpoint: Breakpoint;
}>`
  margin: ${(props) => props.theme.suomifi.spacing.s};
  &&.hidden {
    visibility: hidden;
  }
  padding-right: 1rem;
  padding-left: 1rem;
`;

// main layout

export const SiteContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: start;
`;

export const NavigationContainer = styled.div<{ $breakpoint: Breakpoint }>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: ${(props) => small(props.$breakpoint, '0px', '1px')} solid
    ${(props) => props.theme.suomifi.colors.depthLight1};
`;

// content layout

export const ContentContainer = styled.div<{ $fullScreen?: boolean }>`
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
