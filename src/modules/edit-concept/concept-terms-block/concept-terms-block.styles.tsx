import styled from 'styled-components';
import {
  Block,
  Button,
  Checkbox,
  Dropdown,
  ExpanderGroup,
  Heading,
  Icon,
  RadioButtonGroup,
  Text,
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

export const DropdownBlock = styled(Dropdown)<{ $isSmall?: boolean }>`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
  width: ${(props) => (props.$isSmall ? '100%' : '')};

  .fi-dropdown_button {
    ${(props) =>
      props.$isSmall
        ? `
      width: calc(100% - 50px) !important;
      min-width: min-content !important;
    `
        : ''};
  }
`;

export const WiderTextareaBlock = styled(Textarea)<{ smmargintop?: string }>`
  margin-top: ${(props) =>
    props.smmargintop ? '' : props.theme.suomifi.spacing.m};
  width: 680px;
`;

export const GrammaticalBlock = styled(Block)<{ $isSmall?: boolean }>`
  display: grid;
  gap: ${(props) => props.theme.suomifi.spacing.m};
  margin-top: ${(props) => props.theme.suomifi.spacing.m};

  .fi-single-select {
    ${(props) =>
      props.$isSmall
        ? `
      width: 100% !important;
    `
        : ''};
  }

  .fi-filter-input_input {
    min-width: min-content !important;
    width: 100% !important;
  }
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

export const RadioButtonGroupSpaced = styled(RadioButtonGroup)<{
  $isInvalid?: boolean;
}>`
  margin: ${(props) => props.theme.suomifi.spacing.m} 0;
  max-width: 290px;

  .fi-hint-text {
    font-weight: 600;
    color: ${(props) => props.theme.suomifi.colors.alertBase};
  }

  ${(props) =>
    props.$isInvalid &&
    `
    .fi-icon-radio-base {
      stroke: ${props.theme.suomifi.colors.alertBase} !important;
      stroke-width: 1.3;
    }
  `}
`;

export const OtherTermsExpanderGroup = styled(ExpanderGroup)`
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const ModalDescription = styled(Text)`
  display: inline-block;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
`;

export const ModalTermTypeBlock = styled(Block)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};

  > div:first-of-type {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const ExpanderIcon = styled(Icon)`
  color: ${(props) => props.theme.suomifi.colors.alertBase} !important;
  margin-left: ${(props) => props.theme.suomifi.spacing.xs};
  position: relative;
  top: 3px;
`;

export const TermFormTopBlock = styled(Block)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TermFormBottomBlock = styled(Block)`
  display: flex;
  justify-content: flex-end;
`;

export const TermFormRemoveButton = styled(Button)`
  height: min-content;
  white-space: nowrap;
`;
