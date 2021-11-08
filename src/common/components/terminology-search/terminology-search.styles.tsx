import styled from 'styled-components';

export const SearchCountWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  padding: ${(props) => props.theme.suomifi.spacing.s};
  margin-top: ${(props) => props.theme.suomifi.spacing.s};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  max-width: 100%;
`;

export const SearchDescriptionWrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 16px;
`;

