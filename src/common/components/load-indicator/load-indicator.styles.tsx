import styled, { keyframes } from 'styled-components';
import { Button } from 'suomifi-ui-components';

export const LoadWrapper = styled.div`
  min-height: 100px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.xs};
`;

export const RefetchButton = styled(Button)`
  height: min-content;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

export const TestLoad = styled.div<{ $isSmall: boolean }>`
  margin-top: 50px;

  ::after {
    content: ' ';
    display: block;
    width: ${(props) => (props.$isSmall ? '50px' : '100px')};
    height: ${(props) => (props.$isSmall ? '50px' : '100px')};
    border-radius: 50%;
    border: 3px solid black;
    border-color: ${(props) => props.theme.suomifi.colors.brandBase}
      ${(props) => props.theme.suomifi.colors.brandBase}
      ${(props) => props.theme.suomifi.colors.brandBase} transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`;
