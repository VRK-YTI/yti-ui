import styled from 'styled-components';

export const LinkedItemWrapper = styled.div`
  background: ${(props) => props.theme.suomifi.colors.highlightLight4};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.s};
  justify-content: space-between;

  padding: ${(props) => props.theme.suomifi.spacing.m};
  font-size: 16px;
  max-width: 100%;
  margin-top: ${(props) => props.theme.suomifi.spacing.xxs};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};

  a {
    font-size: 16px;
  }

  .item-content {
    display: flex;
    flex-direction: column;
    height: min-content;
  }

  .datamodel-link {
    margin-top: ${(props) => props.theme.suomifi.spacing.m};
  }

  .fi-text-input {
    min-width: 150px;
    width: auto;
  }

  .fi-button {
    min-width: min-content;
    min-height: min-content;
    white-space: nowrap;
  }
`;
