import styled from 'styled-components';
import { Block, Heading, Textarea, TextInput } from 'suomifi-ui-components';

export const DefinitionTextarea = styled(Textarea)`
  margin-top: ${props => props.theme.suomifi.spacing.m};
  width: 680px;
`;

export const H2Sm = styled(Heading)`
  font-size: 22px !important;
`;

export const SubjectTextInput = styled(TextInput)`
  margin-top: ${props => props.theme.suomifi.spacing.m};
`;

export const ExpanderBlock = styled(Block)`
  margin-top: ${props => props.theme.suomifi.spacing.m};
`;
