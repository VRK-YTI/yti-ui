import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const SideNavigationContainer = styled.div`
  min-height: 100%;
  height: 100%;
  width: min-content;
  display: flex;
  flex-direction: row-reverse;
`;

export const SideNavigationContent = styled.div`
  height: 100%;
  width: 100%;
  padding: ${(props) => props.theme.suomifi.spacing.xs};
  background: ${(props) => props.theme.suomifi.colors.whiteBase};
`;

export const SideNavigationWrapper = styled.div<{ $open: boolean }>`
  min-height: 100%;
  height: 100%;
  overflow: hidden;
  width: ${(props) => (props.$open ? 'min-content' : '0')};
  display: flex;
  flex-direction: row-reverse;
  border-right: ${(props) =>
    props.$open
      ? `1px solid ${props.theme.suomifi.colors.depthLight1}`
      : 'none'};
`;

export const SideNavigationButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  font: 12px;
  height: 100%;
  background: ${(props) => props.theme.suomifi.colors.highlightLight3};

  > *:not(:last-child) {
    border-bottom: 3px solid ${(props) => props.theme.suomifi.colors.whiteBase};
  }
`;

export const SideNavigationButton = styled(Button)<{ $active?: boolean }>`
  height: 100px;
  width: 100px;
  text-transform: uppercase;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-radius: 0;

  ${(props) =>
    props.$active && {
      background: props.theme.suomifi.colors.whiteBase + ' !important;',
      borderLeft:
        '3px solid ' +
        props.theme.suomifi.colors.highlightDark1 +
        ' !important;',
      color: `${props.theme.suomifi.colors.blackBase};`,
    }}
`;

export const ToggleButton = styled(Button)`
  height: 50px;

  path {
    color: ${(props) => props.theme.suomifi.colors.blackBase};
  }
`;
