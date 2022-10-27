import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';

export const PrimaryTextWrapper = styled(Text)`
  display: block;
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  font-size: 18px;
  font-weight: 600;
  line-height: 27px;
`;

export const SecondaryTextWrapper = styled(Text)`
  display: flex;
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  align-items: center;
`;
