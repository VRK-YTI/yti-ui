import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { Block } from 'suomifi-ui-components';

export const HeaderWrapper = styled.div<{
  $breakpoint: Breakpoint;
  $fullHeight?: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 2rem;

  margin: auto;
  padding-right: 1rem;
  padding-left: 1rem;

  ${(props) => `
    background-color: ${props.theme.suomifi.colors.whiteBase};
    border-bottom: 1px solid ${props.theme.suomifi.colors.depthLight1};
    border-top: 3px solid ${props.theme.suomifi.colors.brandBase};
  `}
`;

export const FlexItemBlock = styled(Block)`
  flex: 0 0 calc(1rem*60/18);
`;

export const MobileMenuButtonWrapper = styled.div`
  padding: ${(props) => props.theme.suomifi.spacing.s};
  display: flex;

  button {
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
  transition: background-color 0.3s ease;

  &.ReactModal__Overlay--after-open {
    background-color: rgba(0, 0, 0, 0.6);
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
