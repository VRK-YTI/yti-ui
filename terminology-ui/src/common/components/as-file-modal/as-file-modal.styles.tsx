import styled from 'styled-components';
import { Modal, ModalContent, RadioButtonGroup } from 'suomifi-ui-components';

export const ButtonFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${(props) => props.theme.suomifi.spacing.l};
  gap: ${(props) => props.theme.suomifi.spacing.m};
`;

export const NarrowModal = styled(Modal)`
  ${(props) =>
    props.variant !== 'smallScreen' && 'max-width: 600px !important'};
`;

export const RadioButtonGroupSimple = styled(RadioButtonGroup)`
  margin-top: ${(props) => props.theme.suomifi.spacing.xs};

  .fi-radio-button-group_legend {
    display: none;
  }
`;

export const SimpleModalContent = styled(ModalContent)`
  padding: 24px 30px !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
