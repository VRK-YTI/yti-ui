import styled from 'styled-components';
import { Dropdown, Expander } from 'suomifi-ui-components';

export const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.m};

  .fi-textarea {
    width: 100%;
  }

  .form-label {
    font-size: 22px;
    font-weight: 600;
  }

  hr {
    margin: 0;
  }

  div > button {
    width: min-content;
    white-space: nowrap;
  }
`;

export const LanguageVersionedWrapper = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight4};
  padding: ${(props) => props.theme.suomifi.spacing.s};

  > *:not(:last-child) {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }

  > * {
    width: 100%;
  }
`;

export const ExpanderWithDisable = styled(Expander)<{ $disabled?: boolean }>`
  > div:first-child {
    ${(props) =>
      props.$disabled &&
      `
    background-color: ${props.theme.suomifi.colors.depthLight3};

    span {
      color: ${props.theme.suomifi.colors.blackLight1};
    }
  `}
  }
`;

export const StyledDropdown = styled(Dropdown)<{ $noValue?: boolean }>`
  ${(props) =>
    props.$noValue &&
    `
    .fi-dropdown_button {
      font-style: italic;
      color: ${props.theme.suomifi.colors.depthDark1} !important;
    }
  `}
`;
