import styled from 'styled-components';

export const FormWrapper = styled.div`
  > div {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }

  .wide-text {
    width: 100%;
  }

  .fi-label_label-span {
    white-space: nowrap;
  }
`;

export const LanguageVersionedWrapper = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
  padding: ${(props) => props.theme.suomifi.spacing.s};

  > *:not(:last-child) {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }
`;
