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

export const CountWrapper = styled.div<{isSmall: boolean, border: boolean}>`
  background-color: ${props => (props.isSmall && props.border) ? props.theme.suomifi.colors.depthLight3 : 'parent'};
  border-top: ${props => (props.isSmall && props.border) ? `1px solid ${props.theme.suomifi.colors.depthLight1}` : 'none'};
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: ${props => (props.isSmall && props.border)  ? `0 -${props.theme.suomifi.spacing.s}` : `0px 0px ${props.theme.suomifi.spacing.m}`};
  padding: ${props => (props.isSmall && props.border) ? `${props.theme.suomifi.spacing.m}` : '0'};
`;
