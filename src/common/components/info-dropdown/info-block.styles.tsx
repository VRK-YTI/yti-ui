import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';

export const InfoBlockTitle = styled(Text)`
  font-size: ${(props) => props.theme.suomifi.typography.bodyText};
  font-weight: 600;
`;

export const InfoBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.suomifi.spacing.xs};
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  max-width: 695px;
`;
