import styled from 'styled-components';
import { Heading, Icon, Text } from 'suomifi-ui-components';

export const H2Sm = styled(Heading)`
  font-size: 22px !important;
`;

export const ExpanderTitleButtonPrimaryText = styled(Text)`
  display: block;
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  font-size: 18px;
  font-weight: 600;
  line-height: 27px;
`;

export const ExpanderTitleButtonSecondaryText = styled(Text)`
  display: flex;
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  align-items: center;
`;

export const SuccessIcon = styled(Icon)`
  // expander group has icon color with higher precedence
  color: ${(props) => props.theme.suomifi.colors.successBase} !important;
  margin-left: ${(props) => props.theme.suomifi.spacing.insetXs};
`;
