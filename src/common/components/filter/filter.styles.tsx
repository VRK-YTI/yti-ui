import styled from 'styled-components';
import { Checkbox, RadioButton } from 'suomifi-ui-components';

export const DropdownPlaceholder = styled.i`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
`;

export const FilterCheckbox = styled(Checkbox)`
  font-size: ${props => props.theme.suomifi.values.typography.bodyTextSmall.fontSize.value}px;
  padding-top: 10px;
`;

export const FilterRadioButton = styled(RadioButton)`
  font-size: ${props => props.theme.suomifi.values.typography.bodyTextSmall.fontSize.value}px;
`;

export const FilterWrapper = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  height: max-content;
  width: 350px;

  > div, hr {
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 20px;
  }
`;

export const Header = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  display: flex;
  font-size: ${props => props.theme.suomifi.values.typography.bodyText.fontSize.value}px;
  font-weight: 600;
  padding: 25px 20px 25px;
`;

export const Hr = styled.hr`
  color: ${(props) => props.theme.suomifi.colors.depthLight3};
  margin-left: 20px;
  margin-right: 20px;
`;
