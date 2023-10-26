import styled from 'styled-components';
import { Modal, ModalProps } from 'suomifi-ui-components';

const StyledModal = styled(Modal)`
  ${(props) =>
    props.variant === 'default' &&
    `
width: 95vw !important;
height: 95vh;
`}
`;

export default function LargeModal({
  variant = 'default',
  visible,
  onEscKeyDown,
  children,
}: ModalProps) {
  return (
    <StyledModal
      appElementId="__next"
      visible={visible}
      variant={variant}
      onEscKeyDown={onEscKeyDown}
    >
      {children}
    </StyledModal>
  );
}
