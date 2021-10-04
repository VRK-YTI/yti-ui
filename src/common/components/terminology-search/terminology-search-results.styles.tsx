import styled from 'styled-components';

export const SearchResultContainer = styled.div`
  padding: ${(props) => props.theme.suomifi.spacing.s};
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  &:last-child {
    border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthDark3};
  }
`;
