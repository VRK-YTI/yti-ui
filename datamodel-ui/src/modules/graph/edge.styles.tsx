import styled from 'styled-components';

export const EdgeContent = styled.div<{
  $labelX: number;
  $labelY: number;
  $highlight: boolean;
}>`
  pointer-events: all;
  position: absolute;
  background: #ffffff;
  padding: 5px 20px 5px 10px;
  border-radius: 2px;
  border: 2px solid ${(props) => props.theme.suomifi.colors.accentTertiary};
  fontsize: 16px;
  fontweight: 400;
  paddingright: 20px;
  transform: translate(-50%, -50%)
    translate(${(props) => props.$labelX}px, ${(props) => props.$labelY}px);

  ${(props) =>
    props.$highlight &&
    `
    border: 1px solid ${props.theme.suomifi.colors.warningBase};
    z-index: 2;
  `}
`;

export const DeleteEdgeButton = styled.button`
  border: 0;
  background: none;
  position: fixed;
  top: 0;
  right: 0;
  fontsize: 16px;
  padding: 0 4px;

  &:hover {
    border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.depthLight1};
    border-radius: 2px;
    cursor: pointer;
  }

  &:active {
    background: ${(props) => props.theme.suomifi.colors.depthLight2};
    cursor: pointer;
  }
`;
