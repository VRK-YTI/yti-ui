import styled, { keyframes } from 'styled-components';
import { Block, IconSuccess } from 'suomifi-ui-components';

export const ModalContentWrapper = styled.div`
  margin: 30px 30px 18px 30px;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;

  #loading-block {
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #error-block {
    margin: 0 0 ${(props) => props.theme.suomifi.spacing.xl} 0;
  }

  > div:last-child {
    display: flex;
    flex-direction: row;
    gap: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const SuccessIcon = styled(IconSuccess)`
  color: ${(props) => props.theme.suomifi.colors.successBase};
  width: 46px;
  height: 46px;
`;

export const UpdateDescriptionBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

export const DownloadIndicator = styled.div`
  ::after {
    content: ' ';
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid black;
    border-color: ${(props) => props.theme.suomifi.colors.brandBase}
      ${(props) => props.theme.suomifi.colors.brandBase}
      ${(props) => props.theme.suomifi.colors.brandBase} transparent;
    animation: ${rotate} 1.2s linear infinite;
  }
`;

export const ImportDescriptionBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ButtonBlock = styled(Block)`
  display: flex;
  gap: 20px;
`;
