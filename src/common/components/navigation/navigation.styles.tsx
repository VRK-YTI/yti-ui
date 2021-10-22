import styled from "styled-components";

export const NavigationWrapper = styled.ul`
  display: flex;
  list-style-type: none;
  margin-top: 0px;
  margin-bottom: 0px; 
  padding-inline-start: 0px;

  li {
    padding: 15px 34px 5px 0px;
  }

  li a {
    color: black;
    padding-bottom: 10px;
    &:visited {
      color: black;
    }
    &:hover {
      text-decoration: none;
      color: black;
      border-bottom: 3px solid ${(props) => props.theme.suomifi.colors.highlightBase}
    }
  }
`;