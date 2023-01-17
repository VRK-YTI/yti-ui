import styled from 'styled-components';

export const ModelSideNavigationContainer = styled.div<{ $isSmall: boolean }>`
  ${(props) =>
    props.$isSmall &&
    `
  position: absolute;
  bottom: 0;
  `}

  width: min-content;
`;

export const ViewContainer = styled.div`
  padding: ${(props) => props.theme.suomifi.spacing.s};
`;
