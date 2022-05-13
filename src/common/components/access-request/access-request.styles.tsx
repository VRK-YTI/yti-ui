import styled from 'styled-components';
import {
  Block,
  Button,
  Dropdown,
  Modal,
  ModalContent,
  ModalTitle,
} from 'suomifi-ui-components';

export const AccessRequestDescription = styled.div`
  font-size: 18px;
  margin: ${(props) => props.theme.suomifi.spacing.xs} 0;
`;

export const AccessRequstDropdown = styled(Dropdown)<{ $error: boolean }>`
  .fi-dropdown_button {
    border: 2px solid ${(props) => props.theme.suomifi.colors.alertBase}
      ${(props) => (props.$error ? '!important' : '')};
  }
`;

export const AccessRequestModal = styled(Modal)`
  max-width: 540px !important;

  .fi-modal_footer_content-gradient-overlay {
    visibility: hidden;
    height: 0 !important;

    > * {
      height: 0 !important;
    }
  }
`;

export const AccessRequestModalContent = styled(ModalContent)`
  padding-bottom: 0px !important;
`;

export const CheckboxTitle = styled.h2`
  font-size: 16px;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
`;

export const CheckboxWrapper = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-bottom: 0;
  margin-top: 0;

  li > div {
    font-size: 16px;
    margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
  }

  li:last-child > div {
    margin-bottom: 0;
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
`;
