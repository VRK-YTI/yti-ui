import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';

export const ChipWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.suomifi.spacing.insetM};
`;

export const CountText = styled(Text)`
  font-weight: 600;
`;

export const CountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: ${props => props.theme.suomifi.spacing.m};
`;
