import styled from 'styled-components';
import { Block, Modal, ModalContent } from 'suomifi-ui-components';

export const RemoveModal = styled(Modal)`
  min-height: min-content !important;
  max-width: 540px !important;
`;

export const RemoveModalContent = styled(ModalContent)`
  padding: 24px 30px 35px 30px !important;
`;

export const FooterBlock = styled(Block)`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.suomifi.spacing.s};
  padding: 0 0 20px 30px;
`;
