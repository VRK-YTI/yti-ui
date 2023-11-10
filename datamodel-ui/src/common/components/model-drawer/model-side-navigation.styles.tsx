import styled from 'styled-components';

export const ModelPanel = styled.div<{ $isSmall: boolean }>`
  height: ${(props) => (props.$isSmall ? 'auto' : '100%')};
  display: flex;
  z-index: 1;

  ${(props) =>
    props.$isSmall &&
    `
  bottom: 0;
  max-height: 100%;
  `}
`;

export const ModelDrawerContainer = styled.div<{ $isSmall: boolean }>`
  max-height: 100%;
  width: min-content;
  position: sticky;
  display: flex;
  flex-direction: column;
  padding-top: 2px;
`;

export const DrawerViewContainer = styled.div`
  height: min-content;
  width: inherit;
`;
