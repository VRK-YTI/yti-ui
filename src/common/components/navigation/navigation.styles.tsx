import styled from 'styled-components';
import { NavigationProps } from './navigation-props';

export const NavigationWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-inline-start: 0px;
`;

export const NavigationItem = styled.li<NavigationProps>`

  padding: 15px 40px 5px 0px;

  a.main {
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

  svg {
    position: relative;
    top: 3px;
    left: 5px;
  }

  ${props => props.active ? `a { border-bottom: 3px solid ${props.theme.suomifi.colors.highlightBase} }` : ''}
`;

export const NavigationDropdownWrapper = styled.div`
  position: absolute;
  width: 10rem;
  line-height: 2em;
  background: #fff;
  border: 1px solid #a5acb0;
  z-index: 1;
`;

export const NavigationDropdownList = styled.ul`
  position: static;
  list-style-type: none;
  padding: 0;
  background-color: transparent;
  margin-top: 0;
`;

export const NavigationDropdownItem = styled.li`
  padding: 0px;
  a, a:visited {
    padding-left: 10px;
    text-decoration: none;
    width: 100%;
    color: #000;
    background: transparent;
    border-left: 4px solid transparent;
  }

  a:hover {
    text-decoration: none;
    border-left: 4px solid ${props => props.theme.suomifi.colors.highlightBase};
  }
`;
