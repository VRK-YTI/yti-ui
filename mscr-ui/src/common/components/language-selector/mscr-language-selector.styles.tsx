import styled from 'styled-components';
import {
  Block,
  TextInput,
  MultiSelect as MultiSelectDS,
  Textarea,
} from 'suomifi-ui-components';

export const MultiSelect = styled(MultiSelectDS)<{ $isWide?: boolean }>`
  ${(props) => props.$isWide && 'min-width: 100%'};
`;

export const LanguageBlock = styled(Block)`
    //border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
    //margin-top: ${(props) => props.theme.suomifi.spacing.xs};
    //background: ${(props) => props.theme.suomifi.colors.highlightLight3};

  .name-input {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const WideTextInput = styled(TextInput)`
  width: 100%;
`;

export const DescriptionInput = styled(Textarea)`
  width: 100%;
`;
