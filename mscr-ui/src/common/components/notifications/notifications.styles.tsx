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
  z-index: 200;
  cursor: pointer;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);

  :not(:hover) {
    animation: ${fadeOut} 9s linear;
  }
`;
