import styled, { keyframes } from 'styled-components';
import {
  Block,
  Button,
  Checkbox,
  Icon,
  MultiSelect,
  RadioButtonGroup,
  SingleSelect,
  StaticIcon,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';
import Separator from '../separator';

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
`;

export const FileInfoStaticIcon = styled(StaticIcon)`
  height: 24px;
  width: 20px;
`;

export const FileRemoveButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;

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
`;

export const LangTextInput = styled(TextInput)<{ isSmall: boolean }>`
  min-width: ${(props) => (props.isSmall ? '100%' : '60%')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const MultiselectSmBot = styled(MultiSelect)<{ isSmall: boolean }>`
  min-width: ${(props) => (props.isSmall ? '100%' : '480px')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const RadioButtonGroupSmBot = styled(RadioButtonGroup)`
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const OrgCheckbox = styled(Checkbox)`
  margin-top: ${(props) => props.theme.suomifi.spacing.xs};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const OrgSingleSelect = styled(SingleSelect)<{ isSmall: boolean }>`
  min-width: ${(props) => (props.isSmall ? '100%' : '480px')};
`;

export const SuccessIndicator = styled(Icon)`
  height: 16px;
  width: 20px;
  color: ${(props) => props.theme.suomifi.colors.successBase};
`;

export const TallerSeparator = styled(Separator)`
  margin: 30px 0;
`;

export const TextInputSmBot = styled(TextInput)<{ isSmall: boolean }>`
  min-width: ${(props) => (props.isSmall ? '100%' : '480px')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const TextareaSmBot = styled(Textarea)`
  min-width: 100%;
`;
