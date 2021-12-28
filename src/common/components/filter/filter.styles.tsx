import styled from 'styled-components';
import { Checkbox, RadioButton } from 'suomifi-ui-components';

export const DropdownPlaceholder = styled.i`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
`;

export const FilterCheckbox = styled(Checkbox)`
  font-size: ${props => props.theme.suomifi.typography.bodyTextSmall};
  padding-top: ${props => props.theme.suomifi.spacing.xs};
`;

export const FilterRadioButton = styled(RadioButton)`
  font-size: ${props => props.theme.suomifi.typography.bodyTextSmall};
`;

export const FilterWrapper = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  height: max-content;
  width: 350px;

  > div, hr {
    padding-left: ${props => props.theme.suomifi.spacing.m};
    padding-right: ${props => props.theme.suomifi.spacing.m};
    margin-bottom: ${props => props.theme.suomifi.spacing.m};
  }
`;

export const Header = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  display: flex;
  font-size: ${props => props.theme.suomifi.typography.bodyText};
  font-weight: 600;
  padding: 25px 20px 25px;
`;

export const Hr = styled.hr`
  color: ${(props) => props.theme.suomifi.colors.depthLight3};
  margin-left: ${props => props.theme.suomifi.spacing.m};
  margin-right: ${props => props.theme.suomifi.spacing.m};
`;
