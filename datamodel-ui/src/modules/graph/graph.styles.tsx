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

  .react-flow__panel {
    margin: 0;
    z-index: 4;
  }
`;
