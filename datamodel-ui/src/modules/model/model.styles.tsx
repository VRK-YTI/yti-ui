import styled from 'styled-components';

export const TitleWrapper = styled.div`
  padding: 0 0 ${(props) => props.theme.suomifi.spacing.s}
    ${(props) => props.theme.suomifi.spacing.m};
`;

export const ContentWrapper = styled.div`
  max-height: 70vh;
  height: 100%;

  .react-flow__nodes > * {
    position: absolute;
  }

  .react-flow__attribution {
    display: none;
  }
`;

export const ModelInfoWrapper = styled.div`
  width: 360px;
  height: 70vh;

  h2 {
    font-size: 18px !important;
  }

  :after {
    content: ' ';
    display: block;
    height: ${(props) => props.theme.suomifi.spacing.xl};
  }
`;

export const ModelInfoListWrapper = styled.div`
  > * {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  }
`;
