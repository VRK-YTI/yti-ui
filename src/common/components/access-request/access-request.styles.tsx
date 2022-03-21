import styled from 'styled-components';
import { Block, Button, Modal, ModalFooter } from 'suomifi-ui-components';

export const AccessRequestDescription = styled.div`
  font-size: 18px;
  margin: ${props => props.theme.suomifi.spacing.xs} 0;
`;

export const AccessRequestModal = styled(Modal)`
  max-width: 540px !important;
`;

export const AccessRequestModalFooter = styled(ModalFooter)`

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
