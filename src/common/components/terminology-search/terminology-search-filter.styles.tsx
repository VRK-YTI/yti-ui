import styled from 'styled-components';
import { Checkbox, Icon } from 'suomifi-ui-components';

export const SearchFilterContainer = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600&display=swap');
  padding: 15px;
  background-color: white;
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};;
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};;
  width: 295px;
`;

export const SearchFilterRemoveWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-top: 6px;
  padding-left: 16px;

  &:hover {
    text-decoration: underline;
    text-decoration-color: hsl(212, 63%, 45%);
    cursor: pointer;
  }
`;

export const SearchFilterRemove = styled(Icon)`
  color: hsl(212, 63%, 45%);
  padding-right: 5px;
`;

export const SearchFilterCheckbox = styled(Checkbox)`
  padding-top: 6px;
  font-size: 16px;
`;

export const SearchFilterHr = styled.hr`
  color: ${(props) => props.theme.suomifi.colors.depthLight3};
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const SearchFilterHeader = styled.div`
  padding: 15px;
  background-color: hsl(212, 63%, 45%);
  color: white;
  min-height: 50px;
  display: flex;
  align-items: center;
  width: 297px;

`;
