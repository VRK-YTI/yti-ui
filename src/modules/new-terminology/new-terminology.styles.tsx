import styled, { keyframes } from 'styled-components';
import {
  Block,
  Icon,
  ModalTitle,
  SingleSelect,
} from 'suomifi-ui-components';
import Separator from '@app/common/components/separator';

export const ButtonBlock = styled(Block)`
  display: flex;
  gap: 20px;
`;

export const ErrorIndicator = styled(Icon)`
  height: 24px;
  width: 24px;
  color: ${(props) => props.theme.suomifi.colors.alertBase};
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

export const SuccessIndicator = styled(Icon)`
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
