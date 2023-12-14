import styled from 'styled-components';

export const ClassNodeDiv = styled.div<{
  $highlight: boolean;
  $hover: boolean;
  $appProfile?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
  padding: ${(props) => props.theme.suomifi.spacing.xxs};

  min-width: 360px;
  max-width: 560px;
  width: min-content;

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
    max-width: 100%;

    padding: ${(props) => props.theme.suomifi.spacing.xxs};

    div:first-child {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .react-flow__handle {
    display: none;
  }

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
`;

export const CornerNodeWrapper = styled.div<{
  $highlight?: boolean;
  $applicationProfile?: boolean;
}>`
  padding: 0;
  margin: 0;
  width: 16px;
  height: 16px;
  z-index: 1 !important;
  border: 1px solid transparent;

  box-shadow: none !important;
  background: none;

  .react-flow__handle {
    min-width: 0 !important;
    min-height: 0 !important;
    width: 0;
    height: 0;
    border: 0;
    top: 0;
    bottom: 0;
  }

  .delete-wrapper {
    position: absolute;
    top: -14px;
    right: -12px;
    height: 16px;
    width: 16px;

    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background-color: ${(props) =>
      props.$highlight
        ? props.$applicationProfile
          ? props.theme.suomifi.colors.highlightBase
          : props.theme.suomifi.colors.accentTertiary
        : 'none'};

    svg {
      width: 10px;
      height: 10px;
      color: ${(props) => props.theme.suomifi.colors.whiteBase};
    }

    &:active {
      background-color: ${(props) =>
        props.$applicationProfile
          ? props.theme.suomifi.colors.highlightDark1
          : props.theme.suomifi.colors.accentTertiaryDark1};
    }
  }

  ${(props) =>
    props.$highlight &&
    `
  background-color: ${props.theme.suomifi.colors.whiteBase};
  border-radius: 50%;
  border: 1px solid ${props.theme.suomifi.colors.depthLight1};
  `}

  &:hover {
    background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
    border-radius: 50%;
    border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
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
    padding: 0;
    margin: 0;
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
    padding: 3px;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const Resource = styled.div<{ $highlight?: boolean }>`
  background: #f7f7f8;
  border: 1px solid #c8cdd0;
  border-radius: 2px;
  margin: 2px;
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.xs};
  align-items: center;
  white-space: nowrap;
  min-width: 360px;
  padding: 0px 10px;

  &:hover {
    background: ${(props) => props.theme.suomifi.colors.depthLight2};
  }

  .fi-icon {
    min-height: 17px;
    min-width: 17px;
    height: 17px;
    width: 17px;
  }

  > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .react-flow__handle {
    display: none;
  }

  ${(props) =>
    props.$highlight &&
    `
    border: 3px solid #FAAF00;
    margin: 0;
    `}
`;

export const ResourceTechnicalName = styled.span`
  color: ${(props) => props.theme.suomifi.colors.accentTertiaryDark1};
`;
