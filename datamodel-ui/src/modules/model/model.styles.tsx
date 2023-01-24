import { ReactFlow } from 'reactflow';
import styled from 'styled-components';

export const TitleWrapper = styled.div`
  padding: 0 0 ${(props) => props.theme.suomifi.spacing.s}
    ${(props) => props.theme.suomifi.spacing.m};
`;

export const ContentWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

export const ModelInfoWrapper = styled.div`
  width: 100%;

  h2 {
    font-size: 18px !important;
  }
`;

export const ModelInfoListWrapper = styled.div`
  > * {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

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
`;
