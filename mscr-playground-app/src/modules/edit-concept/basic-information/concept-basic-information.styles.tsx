import styled from 'styled-components';
import {
  Block,
  Expander,
  ExpanderContent,
  ExpanderGroup as ExpanderGroupFi,
  Heading,
  Textarea,
  TextInput,
} from 'suomifi-ui-components';

export const ConceptExpander = styled(Expander)`
  width: 800px;
`;

export const ExpanderGroup = styled(ExpanderGroupFi)`
  margin-top: ${(props) => props.theme.suomifi.spacing.s};
`;

export const ExpanderBlock = styled(Block)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};

  > *:not(:last-child) {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const ExpanderContentFitted = styled(ExpanderContent)`
  > *:not(:last-child) {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const H2Sm = styled(Heading)`
  font-size: 22px !important;
`;

export const SubjectTextInput = styled(TextInput)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const WideTextarea = styled(Textarea)`
  width: 438px;
`;

export const WiderTextarea = styled(Textarea)<{ $smMarginTop?: string }>`
  margin-top: ${(props) =>
    props.$smMarginTop ? '' : props.theme.suomifi.spacing.m};
  width: 680px;
`;
