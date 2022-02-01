import styled from 'styled-components';
import { Alert } from 'suomifi-ui-components';

export const AlertToast = styled(Alert)`
  width: 100%;
`;

export const AlertsWrapper = styled.div`
  position: fixed;
  bottom: ${props => props.theme.suomifi.spacing.xl};
  right: ${props => props.theme.suomifi.spacing.xl};
  max-width: auto;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.suomifi.spacing.m};
`;
