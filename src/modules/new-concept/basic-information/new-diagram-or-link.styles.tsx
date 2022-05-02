import styled from 'styled-components';
import { Modal, ModalContent } from 'suomifi-ui-components';

export const ModalSmWidth = styled(Modal)`
  width: 540px !important;
`;

export const ModalContentFitted = styled(ModalContent)`

  > *:not(:last-child) {
    margin-bottom: ${props => props.theme.suomifi.spacing.m};
  }
`;
