import styled from 'styled-components';
import { Block, Button, Checkbox, MultiSelect, RadioButtonGroup, SingleSelect, StaticIcon, Textarea, TextInput } from 'suomifi-ui-components';
import Separator from '../separator';

export const FileBlock = styled(Block)`
  background-color: ${props => props.theme.suomifi.colors.highlightLight4};
  border: 1px dashed ${props => props.theme.suomifi.colors.highlightLight1};
`;

export const FileInfoBlock = styled(Block)`
  background-color: ${props => props.theme.suomifi.colors.depthLight3};
  border: 1px solid ${props => props.theme.suomifi.colors.depthLight1};
  padding: ${props => props.theme.suomifi.spacing.s};
  display: flex;
  justify-content: space-between;
`;

export const FileInfo = styled.div`
  display: flex;
  gap: ${props => props.theme.suomifi.spacing.s}
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
    margin-left: ${props => props.theme.suomifi.spacing.xxs};
  }
`;

export const FileWrapper = styled.div`
  margin-top: ${props => props.theme.suomifi.spacing.l};
`;

export const LangBlock = styled(Block)`
  min-width: 100%;
  border: 1px solid ${props => props.theme.suomifi.colors.depthLight1};
  margin-bottom: ${props => props.theme.suomifi.spacing.xs};
`;

export const LangTextInput = styled(TextInput)<{isSmall: boolean}>`
  min-width: ${props => props.isSmall ? '100%' : '60%'};
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
`;

export const MultiselectSmBot = styled(MultiSelect)<{isSmall: boolean}>`
  min-width: ${props => props.isSmall ? '100%' : '480px'};
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
`;

export const RadioButtonGroupSmBot = styled(RadioButtonGroup)`
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
`;

export const OrgCheckbox = styled(Checkbox)`
  margin-top: ${props => props.theme.suomifi.spacing.xs};
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
`;

export const OrgSingleSelect = styled(SingleSelect)<{isSmall: boolean}>`
  min-width: ${props => props.isSmall ? '100%' : '480px'};
`;

export const TallerSeparator = styled(Separator)`
  margin: 30px 0;
`;

export const TextInputSmBot = styled(TextInput)<{isSmall: boolean}>`
  min-width: ${props => props.isSmall ? '100%' : '480px'};
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
`;

export const TextareaSmBot = styled(Textarea)`
  min-width: 100%;
`;
