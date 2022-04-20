import styled, { keyframes } from 'styled-components';
import {
  Block,
  Button,
  Checkbox,
  Icon,
  ModalTitle,
  MultiSelect,
  RadioButtonGroup,
  SingleSelect,
  StaticIcon,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import Separator from '../separator';

export const BlankFieldset = styled.fieldset`
  border: 0;
  margin: 0;
  padding: 0;
`;

export const BlankLegend = styled.legend`
  margin: 0;
  padding: 0;
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

export const FileInfoBlock = styled(Block)`
  background-color: ${(props) => props.theme.suomifi.colors.depthLight3};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  padding: ${(props) => props.theme.suomifi.spacing.s};
  display: flex;
  justify-content: space-between;
`;

export const FileInfo = styled.div`
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.s};

  div {
    .fi-paragraph:nth-child(2) .fi-text {
      font-size: 16px;
    }

    .fi-paragraph:nth-child(3) .fi-text {
      font-size: 14px;
    }
  }
`;

export const FileInfoStaticIcon = styled(StaticIcon)`
  height: 24px;
  width: 20px;
`;

export const FileRemoveButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  > :first-child {
    margin-left: ${(props) => props.theme.suomifi.spacing.xxs};
  }
`;

export const FileWrapper = styled.div`
  margin-top: ${(props) => props.theme.suomifi.spacing.l};
`;

const enlarge = keyframes`
  0% {
    scale: 0;
  }

  25% {
    scale: 1
  }

  35% {
    scale: 1
  }

  70% {
    scale: 0;
  }

  100% {
    scale: 0;
  }
`;

export const DownloadIndicator = styled.div<{ startFrame: number }>`
  animation: ${enlarge} 2s linear infinite;
  animation-delay: ${(props) => props.startFrame}ms;
  background: ${(props) => props.theme.suomifi.colors.highlightBase};
  border-radius: 50%;
  height: 21px;
  width: 21px;
`;

export const DownloadIndicatorWrapper = styled(Block)`
  align-items: center;
  background: ${(props) => props.theme.suomifi.colors.depthLight3};
  display: flex;
  height: 100px;
  gap: 6px;
  justify-content: center;
`;

export const LangBlock = styled(Block)`
  min-width: 100%;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
  background: ${(props) => props.theme.suomifi.colors.highlightLight4};
`;

export const LangTextInput = styled(TextInput)<{ isSmall: boolean }>`
  min-width: ${(props) => (props.isSmall ? '100%' : '60%')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
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

export const MultiselectSmBot = styled(MultiSelect)<{ issmall?: boolean }>`
  min-width: ${(props) => (props.issmall ? '100%' : '480px')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const RadioButtonGroupSmBot = styled(RadioButtonGroup)`
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const OrgCheckbox = styled(Checkbox)`
  margin-top: ${(props) => props.theme.suomifi.spacing.xs};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const OrgSingleSelect = styled(SingleSelect)<{ issmall?: boolean }>`
  min-width: ${(props) => (props.issmall ? '100%' : '480px')};

  .fi-filter-input_action-elements-container {
    margin-top: 10px;
  }
`;

export const SuccessIndicator = styled(Icon)`
  height: 16px;
  width: 20px;
  color: ${(props) => props.theme.suomifi.colors.successBase};
`;

export const TallerSeparator = styled(Separator)`
  margin: 30px 0;
`;

export const TextInputSmBot = styled(TextInput)<{ issmall?: boolean }>`
  min-width: ${(props) => (props.issmall ? '100%' : '480px')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const TextareaSmBot = styled(Textarea)`
  min-width: 100%;

  textarea {
    background: white;
  }
`;
