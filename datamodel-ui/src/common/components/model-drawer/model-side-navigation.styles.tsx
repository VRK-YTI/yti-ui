import styled from 'styled-components';

export const ModelDrawerContainer = styled.div<{ $isSmall: boolean }>`
  max-height: 100%;
  width: min-content;
  position: sticky;
  display: flex;
  flex-direction: column;
`;

export const DrawerViewContainer = styled.div`
  height: min-content;
  padding: ${(props) => props.theme.suomifi.spacing.s};
`;
