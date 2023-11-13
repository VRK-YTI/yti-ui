import styled from 'styled-components';

interface EdgeContentProps {
  $applicationProfile?: boolean;
  $labelX: number;
  $labelY: number;
  $highlight: boolean;
  $borderless?: boolean;
}

export const EdgeContent = styled.div<EdgeContentProps>`
  pointer-events: all;
  position: absolute;
  background: #ffffff;
  padding: 5px 10px;
  border-radius: 2px;
  border: ${(props) =>
    !props.$applicationProfile
      ? `2px solid ${props.theme.suomifi.colors.accentTertiary}`
      : 'none'};
  font-size: 16px;
  font-weight: 400;
  transform: translate(-50%, -50%)
    translate(${(props) => props.$labelX}px, ${(props) => props.$labelY}px);

  ${(props) =>
    props.$highlight &&
    `
    border: 1px solid ${props.theme.suomifi.colors.warningBase};
    z-index: 2;
  `}

  ${(props) =>
    props.$borderless &&
    `
      border: 0;
      padding: ${props.theme.suomifi.spacing.xxs};
      color: ${props.theme.suomifi.colors.highlightDark1};
    `};
`;

export const HoveredPath = styled.path<{ $highlight?: boolean }>`
  stroke-width: 10;
  stroke-linecap: round;

  ${(props) =>
    props.$highlight &&
    `
    stroke: ${props.theme.suomifi.colors.depthLight1};
    `}
`;
