import styled from 'styled-components';

export const SearchFilterContainer = styled.div`
  margin-left: 18px;
  padding: 10px;
  background-color: white;
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};;
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};;
`;

export const SearchFilterHeader = styled.div`
  margin-left: 18px;
  padding: 10px;
  background-color: hsl(212, 63%, 45%);
  color: white;
  min-height: 55px;
  display: flex;
  align-items: center;
  padding-left: 8%;
`;
