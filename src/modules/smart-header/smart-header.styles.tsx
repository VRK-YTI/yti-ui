import styled from 'styled-components';

export const HeaderWrapper = styled.div<{ isSmall: boolean }>`
  display: flex;
  align-items: center;
  height: ${props => props.isSmall ? '57px' : '72px'};
  column-gap: ${props => props.isSmall ? '0' : '20px'};
`;

export const LogoWrapper = styled.div`
  flex-grow: 1;
  line-height: 0;

  a {
    display: block;
    line-height: 0;
  }
`;

export const MobileMenuButtonWrapper = styled.div`
  padding: 15px;
  display: flex;

  button {
  }
`;

export const MobileMenuSection = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.suomifi.colors.whiteBase};
`;

export const MobileMenuItem = styled.li<{ active?: boolean, inset?: boolean }>`
  height: 44px;

  * {
    display: block;
    padding-top: 9px;
    padding-bottom: 8px;
    font-weight: ${props => props.active ? 600 : 400};
    padding-left: ${props => props.inset ? '25px' : '10px'};
    border-left: 5px solid ${props => props.active ? props.theme.suomifi.colors.highlightBase : 'transparent'};
  }

  &:hover a {
    border-left: 5px solid ${props => props.theme.suomifi.colors.highlightBase};
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.suomifi.colors.depthSecondary};
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: transparent;
  transition: background-color .3s ease;

  &.ReactModal__Overlay--after-open {
    background-color: rgba(0,0,0,.6);
  }

  &.ReactModal__Overlay--before-close {
    background-color: transparent;
  }
`;

export const ModalContent = styled.div`
  position: absolute;
  max-height: 100%;
  width: 100%;
  border-bottom: 1px solid #a5acb0;
  outline: none;
  overflow-y: auto;
`;
