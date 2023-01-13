import styled from 'styled-components';

export const TitleWrapper = styled.div`
  padding: 0 0 ${(props) => props.theme.suomifi.spacing.s}
    ${(props) => props.theme.suomifi.spacing.m};
`;

export const ContentWrapper = styled.div`
  height: 70vh;

  .react-flow__nodes > * {
    position: absolute;
  }

  .react-flow__attribution {
    visibility: hidden;
  }
`;
