import { ReactFlow } from 'reactflow';
import styled from 'styled-components';
import { InlineAlert } from 'suomifi-ui-components';

export const ModelFlow = styled(ReactFlow)`
  max-height: 100%;
  height: 100%;
  width: 100%;

  .react-flow__nodes > * {
    position: absolute;
  }

  .react-flow__attribution {
    display: none;
  }

  .react-flow__viewport {
    transform-origin: 0 0;
    pointer-events: none;
  }

  .react-flow__renderer {
    z-index: 0;
  }

  .react-flow__panel {
    margin: 0;
    z-index: 1;
  }

  [data-id^='#corner-'] {
    padding: 0;
    margin: 0;
    width: 20px;
    height: 20px;
    z-index: 1 !important;
    margin-left: 10px;
    margin-top: -10px;
    border: 1px solid transparent;
  }

  .react-flow__edge-path {
    stroke: ${(props) => props.theme.suomifi.colors.blackBase};
  }
`;

export const NotificationInlineAlert = styled(InlineAlert)`
  width: max-content !important;

  .fi-inline-alert_text-content-wrapper {
    padding: 0px 5px !important;
    margin: 5px !important;
  }
`;

export const FlowWrapper = styled.div<{ $isSmall: boolean }>`
  height: 100%;
  width: 100%;

  ${(props) =>
    props.$isSmall
      ? `
    position: fixed;
  `
      : `
    position: relative;
    margin-left: -42px;
  `}
`;
