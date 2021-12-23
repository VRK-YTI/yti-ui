import styled from 'styled-components';
import { Button, Checkbox, Dropdown, Icon, RadioButton, SearchInput } from 'suomifi-ui-components';
import { FilterStyledProps } from './filter-props';

export const DropdownPlaceholder = styled.i`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
`;

export const DropdownWrapper = styled(Dropdown)<FilterStyledProps>`
  min-width: ${(props) => props.isModal ? '100%' : 'inherit'}
`;

export const FilterCheckbox = styled(Checkbox)`
  font-size: 16px;
  padding-top: 10px;
`;

export const FilterRadioButton = styled(RadioButton)`
  font-size: 16px;
`;

export const FilterWrapper = styled.div<FilterStyledProps>`
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
  padding: 25px 20px 25px;
`;

export const HeaderButton = styled(Button)`
  background: none;
  font-size: 16px;
  font-weight: 400;
  padding: 0px 5px 0px;
  :hover {
    background: none;
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

export const SearchInputWrapper = styled(SearchInput)<FilterStyledProps>`
  min-width: ${(props) => props.isModal ? '100%' : 'inherit' }
`;
