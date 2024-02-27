import styled from 'styled-components';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};

  div.namespaceInternal {
    display: inherit;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .fi-button {
    height: min-content;
    width: min-content;
    white-space: nowrap;
  }

  a {
    font-size: 16px;
  }
`;

export const SearchResult = styled.div`
  padding: ${(props) => props.theme.suomifi.spacing.s};
  border: 1px solid ${(props) => props.theme.suomifi.colors.blackLight1};

  .fi-link {
    margin-left: ${(props) => props.theme.suomifi.spacing.l};
  }
`;
