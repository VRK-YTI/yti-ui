import styled from 'styled-components';
import {
  Checkbox,
  Dropdown,
  Heading,
  Icon,
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
