import styled from 'styled-components';
import { Block, Button, Modal, ModalContent } from 'suomifi-ui-components';

export const AccessRequestDescription = styled.div`
  font-size: 18px;
  margin: ${props => props.theme.suomifi.spacing.xs} 0;
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
  margin: 0;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.suomifi.spacing.xs};
  > * {
    font-size: 16px;
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
  margin-top: ${props => props.theme.suomifi.spacing.m};
`;
