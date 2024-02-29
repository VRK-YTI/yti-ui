import styled from 'styled-components';
import { Checkbox, CheckboxGroup } from 'suomifi-ui-components';

export const StyledSuomiCheckbox = styled(Checkbox)`
  .fi-checkbox_label {
    padding-left: 48px;
    position: absolute;
  }
  &&.fi-checkbox--checked .fi-checkbox_label::before {
    background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
  }
  &&.fi-checkbox--checked
    .fi-checkbox_label
    > .fi-checkbox_icon
    .fi-icon-base-fill {
    fill: white;
  }
  .fi-hint-text {
    text-align: end;
  }
`;

export const StyledSuomiCheckboxGroup = styled(CheckboxGroup)`
  &&.fi-checkbox-group {
    margin-top: 20px;
  }
`;
