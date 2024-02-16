import { Breakpoint } from '../media-query';
import { resolve } from '../media-query/styled-helpers';
import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const DrawerContainer = styled.div<{
  $open: boolean;
  $isSmall: boolean;
}>`
  max-height: 100%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.$isSmall ? 'column-reverse' : 'row-reverse'};

  position: relative;

  ${(props) =>
    props.$open &&
    `
    button:first-child {
      position: relative;
      right: 1px;
    }
    `}

  .small-screen-wrapper {
    max-height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export const DrawerContent = styled.div.attrs<{
  $isSmall: boolean;
  $width?: number;
}>((props) => ({
  style: {
    width: props.$isSmall
      ? '100vw'
      : props.$width
      ? `${props.$width}px`
      : '390px',
  },
}))<{
  $isSmall: boolean;
  $viewOpen?: boolean;
  $width?: number;
}>`
  background: ${(props) => props.theme.suomifi.colors.whiteBase};

  ${(props) =>
    props.$isSmall &&
    `
    max-height: 100%;
  `}

  ${(props) =>
    props.$isSmall &&
    props.$viewOpen &&
    `
    z-index: 1;
    height: 100vh;
  `}

  /* This is necessary for <DrawerContentWrapper /> to align correctly */
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
`;

export const DrawerWrapper = styled.div<{ $open: boolean }>`
  min-height: min-content;
  max-height: calc(100% - 1px);
  height: 100%;
  width: ${(props) => (props.$open ? 'min-content' : '0')};
  display: flex;
  flex-direction: row-reverse;
  border: ${(props) =>
    props.$open
      ? `1px solid ${props.theme.suomifi.colors.depthDark3}`
      : 'none'};
  border-bottom: none;
`;

export const DrawerButtonGroup = styled.div<{ $isSmall: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isSmall ? 'row' : 'column')};
  height: 100%;
  background: ${(props) => props.theme.suomifi.colors.highlightLight3};

  ${(props) =>
    props.$isSmall
      ? `
      width: 100vw;
      max-width: 100vw;
      height: min-content;
      justify-content: space-evenly;

      > *:not(:last-child) {
        border-right: 3px solid ${props.theme.suomifi.colors.whiteBase};
      }
      `
      : `
      overflow-y: auto;
      overflow-x: hidden;

      > button {
        border-top: 1px solid ${props.theme.suomifi.colors.whiteBase} !important;
        border-bottom: 1px solid ${props.theme.suomifi.colors.whiteBase} !important;
        font-size: 12px;
        padding: 20px 10px;
        height: min-content;
      }
  `}
`;

export const ToggleButton = styled(Button)<{ $open: boolean }>`
  height: 70px;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3} !important;
  border-radius: 0 2px 2px 0;
  background: ${(props) => props.theme.suomifi.colors.whiteBase} !important;
  padding: 15px 0;

  ${(props) => props.$open && 'border-left: none !important;'}

  svg {
    height: 40px !important;
    width: 40px !important;
  }

  path {
    color: ${(props) => props.theme.suomifi.colors.highlightDark1};
  }
`;

export const ToolsButtonGroup = styled.div<{
  $isSmall: boolean;
}>`
  padding: 6px 2px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
  width: min-content;

  button {
    min-width: min-content !important;
    min-height: min-content !important;
    width: 30px !important;
    height: 30px !important;
    padding: 0;
    pointer-events: all;

    ${(props) => props.$isSmall && 'opacity: 0.5;'}

    svg {
      margin: 0 !important;
    }
  }
`;

export const DrawerButton = styled(Button)<{
  $breakpoint: Breakpoint;
  $active?: boolean;
}>`
  height: ${(props) => resolve(props.$breakpoint, 'auto', '50px', '85px')};
  width: ${(props) => resolve(props.$breakpoint, 'auto', '50px', '100px')};
  min-height: ${(props) => resolve(props.$breakpoint, 'auto', '50px', '85px')};
  min-width: ${(props) => resolve(props.$breakpoint, 'auto', '50px', '100px')};
  max-height: 100px !important;
  text-transform: uppercase;
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  white-space: pre;
  border-radius: 0;

  .fi-button_icon--right {
    display: none;
  }

  ${(props) =>
    props.$breakpoint === 'small' &&
    `
    padding: 0;
    min-width: 55px;
    width: 100%;
    height: 60px;
    `}

  ${(props) =>
    props.$active &&
    (props.$breakpoint !== 'small'
      ? {
          background: props.theme.suomifi.colors.whiteBase + ' !important;',
          borderLeft:
            '3px solid ' +
            props.theme.suomifi.colors.highlightDark1 +
            ' !important;',
          color: `${props.theme.suomifi.colors.blackBase} !important;`,
        }
      : {
          background: props.theme.suomifi.colors.whiteBase + ' !important;',
          borderBottom:
            '3px solid ' +
            props.theme.suomifi.colors.highlightDark1 +
            ' !important;',
          color: `${props.theme.suomifi.colors.blackBase} !important;`,
        })}

  svg {
    color: ${(props) =>
      props.$breakpoint !== 'small' && props.$active
        ? props.theme.suomifi.colors.blackBase
        : 'inherit'};
    width: 24px !important;
    height: auto !important;
    margin: 0 !important;
  }
`;

export const WidthDragger = styled.div`
  height: calc(100% - 70px);
  width: 30px;
  cursor: w-resize;
  z-index: -1;

  &:hover {
    background-image: linear-gradient(
      to right,
      ${(props) => props.theme.suomifi.colors.depthLight1},
      transparent
    );
  }

  &:active {
    background-image: linear-gradient(
      to right,
      ${(props) => props.theme.suomifi.colors.depthBase},
      transparent
    );
  }
`;
