import styled from 'styled-components';
import { Alert } from 'suomifi-ui-components';

export const AlertToast = styled(Alert)`
  width: 100%;
`;

export const AlertsWrapper = styled.div<{isSmall: boolean}>`
  position: fixed;
  bottom: ${props => props.isSmall ? props.theme.suomifi.spacing.s : props.theme.suomifi.spacing.m};
  right: ${props => props.isSmall ? props.theme.suomifi.spacing.s : props.theme.suomifi.spacing.xl};
  left:${props => props.isSmall ? props.theme.suomifi.spacing.s : ''};
  max-width: auto;
  display: flex;
  flex-direction: column;
  gap: ${props => props.isSmall ? props.theme.suomifi.spacing.xs : props.theme.suomifi.spacing.s};
`;
