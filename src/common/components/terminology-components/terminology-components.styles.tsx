import styled from 'styled-components';
import {
  Block,
  Checkbox,
  MultiSelect,
  RadioButtonGroup,
  SingleSelect,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';

export const BlankFieldset = styled.fieldset`
  border: 0;
  margin: 0;
  padding: 0;
`;

export const BlankLegend = styled.legend`
  margin: 0;
  padding: 0;
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

export const MultiselectSmBot = styled(MultiSelect)<{ issmall?: boolean }>`
  min-width: ${(props) => (props.issmall ? '100%' : '480px')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const OrgCheckbox = styled(Checkbox)`
  margin-top: ${(props) => props.theme.suomifi.spacing.xs};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const OrgSingleSelect = styled(SingleSelect)<{ issmall?: boolean }>`
  min-width: ${(props) => (props.issmall ? '100%' : '480px')};
`;

export const RadioButtonGroupSmBot = styled(RadioButtonGroup)`
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const TextareaSmBot = styled(Textarea)`
  min-width: 100%;

  textarea {
    background: white;
  }
`;

export const TextInputSmBot = styled(TextInput)<{ issmall?: boolean }>`
  min-width: ${(props) => (props.issmall ? '100%' : '480px')};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;
