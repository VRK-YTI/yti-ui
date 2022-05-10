import styled from 'styled-components';
import { Heading, Icon } from 'suomifi-ui-components';

export const LargeHeading = styled(Heading)`
  font-size: 22px !important;
`;

export const MediumHeading = styled(Heading)`
  font-size: 18px !important;
  line-height: 24px !important;
`;

export const SuccessIcon = styled(Icon)`
  // expander group has icon color with higher precedence
  color: ${(props) => props.theme.suomifi.colors.successBase} !important;
  margin-left: ${(props) => props.theme.suomifi.spacing.insetXs};
`;
