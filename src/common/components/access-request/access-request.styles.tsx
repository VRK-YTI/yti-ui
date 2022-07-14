import styled from 'styled-components';
import { Block, Button, Dropdown, ModalTitle } from 'suomifi-ui-components';

export const AccessRequestDescription = styled.div`
  font-size: 18px;
  margin: ${(props) => props.theme.suomifi.spacing.xs} 0;
`;

export const AccessRequestDropdown = styled(Dropdown)<{ $error: boolean }>`
  .fi-dropdown_button {
    border: 2px solid ${(props) => props.theme.suomifi.colors.alertBase}
      ${(props) => (props.$error ? '!important' : '')};
  }
`;

export const Title = styled.h2`
  font-size: 18px;
  margin: 0;
`;

export const ModalButton = styled(Button)`
  white-space: nowrap;
  width: min-content;
`;

export const ModalContentBlock = styled(Block)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const ModalTitleH1 = styled(ModalTitle)`
  font-size: 22px;
  margin-top: 0px;
`;
