import styled from 'styled-components';
import { Block, Checkbox, MultiSelect, RadioButtonGroup, SingleSelect, Textarea, TextInput } from 'suomifi-ui-components';
import Separator from '../separator';

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
