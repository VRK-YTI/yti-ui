import styled from 'styled-components';
import { Checkbox, Icon, RadioButton } from 'suomifi-ui-components';
import { FilterWrapperProps } from './filter-props';

export const DropdownPlaceholder = styled.i`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
`;

export const FilterCheckbox = styled(Checkbox)`
  font-size: 16px;
  padding-top: 10px;
`;

export const FilterRadioButton = styled(RadioButton)`
  font-size: 16px;
`;

export const FilterWrapper = styled.div<FilterWrapperProps>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  height: max-content;
  width: ${(props) => props.isModal ? '100%' : '350px'};

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
  font-size: 18px;
  font-weight: 600;
  justify-content: space-between;
  padding: 25px 20px 30px;

  span {
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

export const Hr = styled.hr`
  color: ${(props) => props.theme.suomifi.colors.depthLight3};
  margin-left: 20px;
  margin-right: 20px;
`;

export const RemoveIcon = styled(Icon)`
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  padding-right: 5px;
`;

export const RemoveWrapper = styled.div`
  align-items: center;
  display: flex;
  font-weight: 600;
  margin-left: 14px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
    text-decoration-color: ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;
