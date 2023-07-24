import styled from 'styled-components';

export const ClassNodeDiv = styled.div<{
  $highlight: boolean;
  $hover: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
  width: 360px;
  padding: 5px;

  ${(props) =>
    props.$hover &&
    `
    background: ${props.theme.suomifi.colors.accentTertiaryDark1};
  `}

  ${(props) =>
    props.$highlight &&
    `
    background: #FAAF00;
  `}

  > div {
    max-width: 100%;
    padding: 0 10px;
  }

  .node-title {
    background: ${(props) => (!props.$highlight ? '#9B5CB2' : '#E86717')};
    color: ${(props) => props.theme.suomifi.colors.whiteBase};
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #86499c;
    border-radius: 2px 2px 0px 0px;
    font-weight: 600;

    *:first-child {
      flex-grow: 1;
    }
  }

  .react-flow__handle {
    display: none;
  }

  button {
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
  }
`;

export const Attribute = styled.div<{ $highlight?: boolean }>`
  background: #f7f7f8;
  border: 1px solid #c8cdd0;
  border-radius: 2px;
  margin: 2px;

  &:hover {
    background: ${(props) => props.theme.suomifi.colors.depthLight2};
  }

  ${(props) =>
    props.$highlight &&
    `
    border: 3px solid #FAAF00;
    margin: 0;
    `}
`;
