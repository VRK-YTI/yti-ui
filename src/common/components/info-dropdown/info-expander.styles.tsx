import styled from 'styled-components';
import { Expander } from 'suomifi-ui-components';

export const InfoExpanderWrapper = styled(Expander)`
  margin-top: ${props => props.theme.suomifi.spacing.m};
`;

export const InfoExpanderDivider = styled.hr`
  border: 0;
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  margin: ${props => props.theme.suomifi.spacing.xl} 0;
`;
