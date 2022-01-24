import styled from 'styled-components';
import { Checkbox, MultiSelect, SingleSelect, TextInput } from 'suomifi-ui-components';

export const MultiselectSmBot = styled(MultiSelect)<{isSmall: boolean}>`
  min-width: ${props => props.isSmall ? '100%' : '480px'};
  margin-bottom: 30px;
`;

export const OrgCheckbox = styled(Checkbox)`
  margin-top: ${props => props.theme.suomifi.spacing.xs};
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
`;

export const OrgSingleSelect = styled(SingleSelect)<{isSmall: boolean}>`
  min-width: ${props => props.isSmall ? '100%' : '480px'};
`;

export const ContactTextInput = styled(TextInput)<{isSmall: boolean}>`
  min-width: ${props => props.isSmall ? '100%' : '480px'};
`;
