import styled from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const SideNavigationContainer = styled.div`
  min-height: 100%;
  height: 100%;
  width: min-content;
  display: flex;
  flex-direction: row-reverse;
  margin: ${(props) => props.theme.suomifi.spacing.s};
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
  border: ${(props) =>
    props.$open
      ? `1px solid ${props.theme.suomifi.colors.depthLight1}`
      : 'none'};

  border-right: 0;
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

export const SideNavigationVisibleButtonGroup = styled.div`
  padding: 6px 2px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;

  background: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-top: 0;
  border-radius: 0 2px 2px 0;

  button {
    min-width: min-content !important;
    min-height: min-content !important;
    width: 30px !important;
    height: 30px !important;
    padding: 0;

    svg {
      margin: 0 !important;
    }
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
      color: `${props.theme.suomifi.colors.blackBase} !important;`,
    }}

  svg {
    color: ${(props) =>
      props.$active ? props.theme.suomifi.colors.blackBase : 'inherit'};
    width: 20px !important;
    height: auto !important;
    margin: 0 !important;
  }
`;

export const ToggleButton = styled(Button)`
  height: 70px;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1} !important;
  border-radius: 0 2px 2px 0;
  background: ${(props) => props.theme.suomifi.colors.whiteBase} !important;
  padding: 15px 0;
  // box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.2);

  svg {
    height: 40px !important;
    width: 40px !important;
  }

  path {
    color: ${(props) => props.theme.suomifi.colors.blackBase};
  }
`;
