import styled from 'styled-components';
import { NavigationProps } from './navigation-props';

export const NavigationWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-inline-start: 0px;
  gap: ${(props) => props.theme.suomifi.spacing.xl};
`;

export const NavigationItem = styled.li<NavigationProps>`
  display: block;

  a.main {
    display: block;
    color: ${(props) => props.theme.suomifi.colors.blackBase};
    padding: 12px 5px 9px 5px;
    border-bottom: 3px solid
      ${(props) =>
        props.$active
          ? props.theme.suomifi.colors.highlightBase
          : 'transparent'};

    &:visited {
      color: ${(props) => props.theme.suomifi.colors.blackBase};
    }
    &:hover {
      text-decoration: none;
      color: ${(props) => props.theme.suomifi.colors.blackBase};
      border-bottom: 3px solid
        ${(props) => props.theme.suomifi.colors.highlightBase};
    }
  }

  svg {
    position: relative;
    top: 3px;
    left: 5px;
  }
`;

export const NavigationDropdownWrapper = styled.div<NavigationProps>`
  position: absolute;
  width: 10rem;
  line-height: 2em;
  background: #fff;
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  z-index: 1;
`;

export const NavigationDropdownList = styled.ul`
  position: static;
  list-style-type: none;
  padding: 8px 0px;
  background-color: transparent;
  margin-top: 0;
`;

export const NavigationDropdownItem = styled.li<NavigationProps>`
  padding: 0px;
  a,
  a:visited {
    display: block;
    padding: 8px 11px;
    text-decoration: none;
    width: 100%;
    color: #000;
    background: transparent;
    border-left: 4px solid transparent;
  }

  a:hover {
    text-decoration: none;
    border-left: 4px solid
      ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;

export const MobileMenuSection = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
`;

export const MobileMenuItem = styled.li<{
  $active?: boolean;
  $inset?: boolean;
}>`
  height: 44px;

  * {
    display: block;
    padding-top: 9px;
    padding-bottom: 8px;
    font-weight: ${(props) => (props.$active ? 600 : 400)};
    padding-left: ${(props) => (props.$inset ? '25px' : '10px')};
    border-left: 5px solid
      ${(props) =>
        props.$active
          ? props.theme.suomifi.colors.highlightBase
          : 'transparent'};
  }

  &:hover a {
    border-left: 5px solid
      ${(props) => props.theme.suomifi.colors.highlightBase};
  }

  &:not(:last-child) {
    border-bottom: 1px solid
      ${(props) => props.theme.suomifi.colors.depthSecondary};
  }
`;
