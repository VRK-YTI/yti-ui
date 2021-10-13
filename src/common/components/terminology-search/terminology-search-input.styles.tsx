import styled from 'styled-components';

export const SearchContainer = styled.div`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};
  padding: ${(props) => props.theme.suomifi.spacing.s};
  margin-top: ${(props) => props.theme.suomifi.spacing.s};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
`;

export const SearchButtonContainer = styled.div`
  margin-top: 15px;
`;
