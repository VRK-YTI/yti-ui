import styled from 'styled-components';
import { Block, Button, Dropdown, ExpanderGroup } from 'suomifi-ui-components';

export const SearchBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.suomifi.colors.depthLight3};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  padding: 10px 20px 20px 20px;

  > div {
    display: flex;
    flex-direction: row;
    gap: ${(props) => props.theme.suomifi.spacing.s};
  }

  > div:first-child {
    margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  }
`;

export const SearchDropdown = styled(Dropdown)`
  max-width: 250px;

  .fi-dropdown_button {
    width: 203px !important;
    min-width: 0px !important;
  }
`;

export const SearchResultCountBlock = styled(Block)`
  background: ${(props) => props.theme.suomifi.colors.depthLight3};
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  padding: 10px 20px;
`;

export const ResultBlock = styled(ExpanderGroup)`
  margin-top: ${(props) => props.theme.suomifi.spacing.s};
`;

export const FooterButton = styled(Button)`
  margin-top: ${(props) => props.theme.suomifi.spacing.xs} !important;
`;

export const SelectedConceptBlock = styled(Block)`
  display: flex;
  gap: ${(props) => props.theme.suomifi.spacing.xs};
  flex-wrap: wrap;
`;
