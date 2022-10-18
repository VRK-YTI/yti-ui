import styled from 'styled-components';

export const AlertsWrapper = styled.div<{
  $scrollPos: number;
  $fromTop: number;
}>`
  width: 100%;

  position: ${(props) =>
    props.$scrollPos > props.$fromTop ? 'fixed' : 'auto'};
  top: ${(props) => (props.$scrollPos > props.$fromTop ? '0' : 'auto')};
  z-index: ${(props) => (props.$scrollPos > props.$fromTop ? '100' : 'auto')};

  > section {
    display: flex;
    justify-content: center;
    align-items: center;

    > div {
      width: 100%;
      max-width: 1100px;
    }
  }
`;
