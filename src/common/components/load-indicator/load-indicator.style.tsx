import styled, { keyframes } from "styled-components";
import { Button, Icon } from "suomifi-ui-components";

export const LoadWrapper = styled.div`
  position: absolute;
  min-height: 350px;
  height: 100%;
  width: calc(100% + 20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -10px;
  margin-left: -10px;
  border-radius: 10px;
  gap: ${(props) => props.theme.suomifi.spacing.xs};
`;

const rotate = keyframes`
  from { transform: rotate(360deg); };
  to { transform: rotate(0deg); };
`;

export const LoadIcon = styled(Icon)<{ isSmall: boolean }>`
  width: ${(props) => (props.isSmall ? "50px" : "100px")};
  height: ${(props) => (props.isSmall ? "50px" : "100px")};
  animation: ${rotate} 2s linear infinite;
  color: ${(props) => props.theme.suomifi.colors.highlightLight1};
  margin-top: ${(props) => props.theme.suomifi.spacing.xl};
`;

export const RefetchButton = styled(Button)`
  height: min-content;
`;
