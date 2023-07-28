import styled from 'styled-components';

export const ClassNodeDiv = styled.div<{
  $highlight: boolean;
  $hover: boolean;
  $appProfile?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
  width: 360px;

  > div {
    max-width: 100%;
    padding: 0 10px;
  }

  .node-title {
    background: ${(props) =>
      props.$appProfile
        ? props.theme.suomifi.colors.highlightDark1
        : !props.$highlight
        ? '#9B5CB2'
        : '#E86717'};
    color: ${(props) => props.theme.suomifi.colors.whiteBase};
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid
      ${(props) =>
        props.$appProfile ? props.theme.suomifi.colors.brandBase : '#86499c'};
    border-radius: 2px 2px 0px 0px;
    font-weight: 600;

    *:first-child {
      flex-grow: 1;
    }

    height: ${(props) => (props.$appProfile ? '37px' : '27px')};
  }

  .react-flow__handle {
    display: none;
  }
`;

export const CollapseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: none;
  height: 20px;
  width: 30px;

  svg {
    padding 0;
    margin 0;
    color: ${(props) => props.theme.suomifi.colors.whiteBase};
    width: 24px;
    height: 24px;
  }

  &:hover {
    cursor: pointer;
  }

  &:active {
    svg {
      color: ${(props) => props.theme.suomifi.colors.depthLight1};
    }
  }
`;

export const OptionsButton = styled.button`
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid ${(props) => props.theme.suomifi.colors.highlightBase};
  background: ${(props) => props.theme.suomifi.colors.whiteBase};

  svg {
    height: 16px;
    width: 16px;
  }

  &:hover {
    cursor: pointer;
  }
`;
