import { ReactFlow } from 'reactflow';
import styled from 'styled-components';

export const TitleWrapper = styled.div<{ $fullScreen?: boolean }>`
  padding: 0 0 ${(props) => props.theme.suomifi.spacing.s}
    ${(props) => props.theme.suomifi.spacing.m};

  ${(props) =>
    props.$fullScreen &&
    `
    flex: 1;
    display: flex;
    gap: 20px;
    align-items: center;

    max-height: min-content;
    overflow: hidden;

    .tools {
      display: inherit;
      gap: inherit;
      align-self: flex-start;
      padding-top: 20px;
    }
  `}
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
