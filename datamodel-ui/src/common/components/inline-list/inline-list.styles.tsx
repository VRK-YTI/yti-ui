import styled from 'styled-components';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;

  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-bottom: none;
`;

export const ListItem = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
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
