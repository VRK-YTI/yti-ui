import styled from 'styled-components';

export const ToolsTooltip = styled.div`
  width: 295px;
  height: 327px;
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
    flex-direction: ;
  }

  .fi-toggle--button > * > .fi-text--body {
    word-break: normal !important;
    font-size: 16px;
  }
`;
