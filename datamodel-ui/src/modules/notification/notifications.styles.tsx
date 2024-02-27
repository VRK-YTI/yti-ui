import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  90% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
`;

export const NotificationWrapper = styled.div<{ $visible?: boolean }>`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);

  animation: ${fadeOut} 5s linear;
`;
