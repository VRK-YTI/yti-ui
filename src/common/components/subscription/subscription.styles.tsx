import styled from 'styled-components';
import { Modal, ModalContent } from 'suomifi-ui-components';

export const RemoveModal = styled(Modal)`
  width: 540px !important;

  .fi-modal_footer_content-gradient-overlay {
    visibility: hidden;
    height: 0 !important;
    > * {
      height: 0 !important;
    }
  }
`;

export const RemoveModalContent = styled(ModalContent)`
  padding-bottom: 0px !important;
`;

export const RemoveModalUl = styled.ul`
  padding: 0;
  margin: 5px 0px 0px 0px;
  list-style: none;
`;
