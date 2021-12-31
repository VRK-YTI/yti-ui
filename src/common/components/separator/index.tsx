import styled from 'styled-components';

const Separator = styled.hr<{ large?: boolean }>`
  border: 0;
  border-top: 1px solid ${props => props.theme.suomifi.colors.depthLight1};
  margin: ${props => props.large ? '30px' : '20px'} 0;
`;

export default Separator;
