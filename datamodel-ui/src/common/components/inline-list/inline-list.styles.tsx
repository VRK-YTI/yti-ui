import styled from 'styled-components';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  > div:not(:last-child) {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.s};
  }
`;

export const ListItem = styled.div`
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};

  background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.suomifi.spacing.s};

  .fi-button {
    white-space: nowrap;
    min-width: min-content;
  }

  .fi-link--external {
    font-size: 16px;
  }
`;
