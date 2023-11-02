import styled from 'styled-components';

export const ResultTextWrapper = styled.div`
  padding-left: 30px;
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthDark2};
`;

export const ResultIconWrapper = styled.div`
  position: absolute;
`;

export const ChipWrapper = styled.div`
  display: inline;
  margin: 3px;
`;
