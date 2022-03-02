import styled from 'styled-components';

export const StyledHr = styled.hr<{ isLarge?: boolean }>`
  border: 0;
  border-top: 1px solid ${props => props.theme.suomifi.colors.depthLight1};
  margin: ${props => props.isLarge ? '30px' : '20px'} 0;
`;
