import styled, { keyframes } from 'styled-components';
import { Icon } from 'suomifi-ui-components';

const fadein = keyframes`
  from { opacity: 0; };
  to { opacity: 1; };
`;

export const LoadWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: calc(100% + 20px);
  zIndex: 100;

  /* This color based on depthDark2 */
  background-color: #6d787e30;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 10px;

  opacity: 0;
  animation: ${fadein} 0.1s linear 3s forwards;
`;


const rotate = keyframes`
  from { transform: rotate(360deg); };
  to { transform: rotate(0deg); };
`;

export const LoadIcon = styled(Icon)`
  width: 100px;
  height: 100px;
  animation: ${rotate} 3s linear infinite;
  color: ${props => props.theme.suomifi.colors.highlightLight1};
`;
