import styled from 'styled-components';
import { Button, Checkbox, RadioButton } from 'suomifi-ui-components';
import { FilterStyledProps } from './filter-props';

export const CloseWrapper = styled.div`
  * {
    margin-bottom: ${props => props.theme.suomifi.spacing.s}
  }
`;

export const DropdownPlaceholder = styled.i`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
`;

export const DropdownWrapper = styled.div`
  min-width: inherit;

  > span {
    min-width: 100%;

    > div > div > * {
      width: calc(100% - 47px);
    }
  }
`;

export const FilterCheckbox = styled(Checkbox)`
  font-size: ${props => props.theme.suomifi.typography.bodyTextSmall};
  padding-top: ${props => props.theme.suomifi.spacing.xs};
`;

export const FilterRadioButton = styled(RadioButton)`
  font-size: ${props => props.theme.suomifi.typography.bodyTextSmall};
`;

export const FilterWrapper = styled.div<FilterStyledProps>`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: solid 1px ${(props) => props.isModal ? 'none' : props.theme.suomifi.colors.depthLight1};
  height: max-content;
  width: ${(props) => props.isModal ? '100%' : '350px'};
  margin-bottom: ${(props) => props.isModal ? '0px' : '80px'};
`;

export const Header = styled.div`
  align-items: center;
  background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  display: flex;
  font-size: ${props => props.theme.suomifi.typography.bodyText};
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

export const FilterContent = styled.div`
  margin: 20px;
`;
