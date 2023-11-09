import { ReactFlow } from 'reactflow';
import styled from 'styled-components';

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
