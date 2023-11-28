import { Panel } from 'reactflow';
import styled from 'styled-components';

export const ToolsPanel = styled(Panel)``;

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

export const TipTooltipWrapper = styled.div<{
  $x?: number | null;
  $y?: number | null;
}>`
  position: absolute;
  right: 50px;
  top: calc(${(props) => props.$y}px - 146px);

  button {
    visibility: hidden !important;
    display: none !important;
  }

  .fi-tooltip_content {
    padding: ${(props) =>
      `${props.theme.suomifi.spacing.xxs} ${props.theme.suomifi.spacing.s}`};
    white-space: nowrap;
  }
`;
