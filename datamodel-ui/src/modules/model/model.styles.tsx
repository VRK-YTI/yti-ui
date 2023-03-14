import { ReactFlow } from 'reactflow';
import styled from 'styled-components';
import { Block, SearchInput } from 'suomifi-ui-components';

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

export const TooltipWrapper = styled(Block)`
  > button {
    display: none;
  }

  div {
    background-color: ${(props) =>
      props.theme.suomifi.colors.whiteBase} !important;
    padding: 2px !important;
    position: absolute !important;
    right: 15px;
    width: min-content;
    height: min-content;
    z-index: 2;
    display: flex;
    flex-direction: column;

    hr {
      width: auto;
      margin: 4px 10px;
      color: ${(props) => props.theme.suomifi.colors.depthLight3};
    }

    > button {
      min-width: min-content !important;
      word-break: keep-all !important;
      white-space: nowrap !important;
      padding-left: 10px;
      text-align: start;
      color: ${(props) => props.theme.suomifi.colors.blackBase} !important;
      font-weight: 400;
    }

    > button:last-child {
      display: none;
      visibility: hidden;
      aria-hidden: true;
    }
  }
`;

export const FullwidthSearchInput = styled(SearchInput)`
  width: 100%;
  max-width: 380px;
`;

export const StaticHeaderWrapper = styled.div`
  width: inherit;
  max-width: inherit;
  position: fixed;
  background: ${(props) => props.theme.suomifi.colors.whiteBase};
  z-index: 2;
  height: min-content;

  h2 {
    font-size: 18px !important;
  }

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: ${(props) => props.theme.suomifi.spacing.s};
    padding-bottom: 0;
  }
`;
