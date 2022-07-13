import styled from 'styled-components';
import {
  Block,
  Checkbox,
  Dropdown,
  Heading,
  Icon,
  RadioButtonGroup,
  Textarea,
} from 'suomifi-ui-components';

export const LargeHeading = styled(Heading)`
  font-size: 22px !important;
`;

export const MediumHeading = styled(Heading)`
  font-size: 18px !important;
  line-height: 24px !important;
`;

export const SuccessIcon = styled(Icon)`
  // expander group has icon color with higher precedence
  color: ${(props) => props.theme.suomifi.colors.successBase} !important;
  margin-left: ${(props) => props.theme.suomifi.spacing.insetXs};
`;

export const CheckboxBlock = styled(Checkbox)`
  margin-top: ${(props) => props.theme.suomifi.spacing.s};
`;

export const DropdownBlock = styled(Dropdown)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const WiderTextareaBlock = styled(Textarea)<{ smmargintop?: string }>`
  margin-top: ${(props) =>
    props.smmargintop ? '' : props.theme.suomifi.spacing.m};
  width: 680px;
`;

export const GrammaticalBlock = styled(Block)`
  display: grid;
  gap: ${(props) => props.theme.suomifi.spacing.m};
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const TermEquivalencyBlock = styled(Block)`
  display: grid;
  font-size: 16px;
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  width: min-content;

  label {
    font-weight: 600;
    margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};

    span {
      font-weight: 400;
    }
  }
`;

export const RadioButtonGroupSpaced = styled(RadioButtonGroup)`
  margin: ${(props) => props.theme.suomifi.spacing.m} 0;
  max-width: 290px;
`;
