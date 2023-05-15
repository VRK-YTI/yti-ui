import styled from 'styled-components';
import { Modal } from 'suomifi-ui-components';

export const WideModal = styled(Modal)`
  ${(props) =>
    props.variant === 'default' &&
    `
width: 95vw !important;
`}
`;
