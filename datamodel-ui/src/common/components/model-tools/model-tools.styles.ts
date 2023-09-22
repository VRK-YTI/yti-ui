import { Panel } from 'reactflow';
import styled from 'styled-components';

export const ToolsPanel = styled(Panel)`
  pointer-events: none !important;
`;

export const ToolsTooltip = styled.div`
  width: 295px;
  min-height: 200px;
  height: max-content;
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthBase};
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.s};
  padding: ${(props) => props.theme.suomifi.spacing.s};

  * > {
    min-width: 100%;
  }
`;

export const ToggleButtonGroup = styled.div`
  display: flex;
  flex-direction: column;

  .fi-hint-text {
    font-weight: 600;
    margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
  }

  .fi-toggle--button > * {
    display: flex;
  }

  .fi-toggle--button > * > .fi-text--body {
    word-break: normal !important;
    white-space: nowrap;
    font-size: 16px;
  }
`;
