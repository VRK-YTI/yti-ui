import styled from 'styled-components';

export const ClassFormWrapper = styled.div<{ $height?: number }>`
  padding: ${(props) => props.theme.suomifi.spacing.s};
  padding-top: ${(props) => props.$height}px;

  > div {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }

  .spread-content {
    > *:not(:last-child) {
      margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
    }
  }

  .fi-text-input,
  .fi-textarea {
    width: 100% !important;
  }
`;

export const LanguageVersionedWrapper = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
  padding: ${(props) => props.theme.suomifi.spacing.s};

  > *:not(:last-child) {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }
`;
