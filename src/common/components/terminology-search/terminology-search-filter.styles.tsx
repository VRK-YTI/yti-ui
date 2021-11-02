import styled from 'styled-components';

export const SearchFilterContainer = styled.div`
  padding: 15px;
  background-color: white;
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};;
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};;
  width: 295px;

  hr {
    color: ${(props) => props.theme.suomifi.colors.depthLight3};
  }

  Dropdown {
    max-width: 80%;
    min-width: 30%;
    width: 80%;
  }

`;

export const SearchFilterHeader = styled.div`
  padding: 15px;
  background-color: hsl(212, 63%, 45%);
  color: white;
  min-height: 55px;
  display: flex;
  align-items: center;
  width: 297px;

  .Text {
    margin: 50px;
    padding: 40px;
  }
`;
