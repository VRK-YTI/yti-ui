import styled from 'styled-components';
import { Button, Modal } from 'suomifi-ui-components';

export const LargeModal = styled(Modal)`
  ${(props) =>
    props.variant === 'default' &&
    `
    width: 95vw !important;
  `}
`;

export const OpenModalButton = styled(Button)`
  width: min-content;
  white-space: nowrap;
`;
