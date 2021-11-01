import styled from 'styled-components';
import { HamburgerMenuProps } from './hamburger-menu-props';

export const MenuWrapper = styled.div`
  display: flex;
  justify-content: end;
`;

export const MenuItemWrapper = styled.div<HamburgerMenuProps>`
  padding-left: ${props => props.subPage ? '30px' : '0px'};

  li {
    ${props => props.active ? `border-left: 4px solid ${props.theme.suomifi.colors.highlightBase}` : ''}
  }

  li > span, a, a:visited {
    color: ${props => props.theme.suomifi.colors.blackBase};
  }
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  button {
    width: 100%;
  }
`;
