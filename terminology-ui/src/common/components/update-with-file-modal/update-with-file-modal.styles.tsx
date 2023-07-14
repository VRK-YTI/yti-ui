import styled, { keyframes } from 'styled-components';
import {
  Block,
  IconCheck,
  IconCheckCircleFilled,
  ModalTitle,
  SingleSelect,
} from 'suomifi-ui-components';
import Separator from 'yti-common-ui/separator';

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

export const SuccessIcon = styled(IconCheckCircleFilled)`
  color: ${(props) => props.theme.suomifi.colors.successBase};
  width: 46px;
  height: 46px;
`;

export const UpdateDescriptionBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ButtonBlock = styled(Block)`
  display: flex;
  gap: 20px;
`;

export const FileBlock = styled(Block)`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
  border: 1px dashed ${(props) => props.theme.suomifi.colors.highlightLight1};
`;

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;

export const FileUploadWrapper = styled(Block)`
  align-items: center;
  display: flex;
  flex-direction: column;
  min-height: min-content;
  height: 100px;
  gap: 6px;
  justify-content: center;
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

export const MissingInfoAlertUl = styled.ul`
  padding: 0;
  margin: 0;
  margin-top: 6px;
  padding-left: 14px;
`;

export const ModalTitleAsH1 = styled(ModalTitle)`
  font-size: 22px;
  margin-top: 0;
  margin-bottom: 28px;
`;

export const SuccessIndicator = styled(IconCheck)`
  height: 20px;
  width: 20px;
  padding: 10px;
  background-color: ${(props) => props.theme.suomifi.colors.successBase};
  border-radius: 50%;
`;

export const TallerSeparator = styled(Separator)`
  margin: 30px 0;
`;

export const StatusSingleSelect = styled(SingleSelect)<{ $isSmall?: boolean }>`
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  min-width: ${(props) => (props.$isSmall ? '100%' : '480px')};
  width: min-content;
`;

export const FooterBlock = styled(Block)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.s};
`;
