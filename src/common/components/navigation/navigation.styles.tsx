import styled from 'styled-components';

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
    color: ${(props) => props.theme.suomifi.colors.blackBase};
    padding-bottom: 10px;
    &:visited {
      color: ${(props) => props.theme.suomifi.colors.blackBase};
    }
    &:hover {
      text-decoration: none;
      color: ${(props) => props.theme.suomifi.colors.blackBase};
      border-bottom: 3px solid ${(props) => props.theme.suomifi.colors.highlightBase}
    }
  }
`;
