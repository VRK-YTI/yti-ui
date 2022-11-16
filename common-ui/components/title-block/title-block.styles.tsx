import styled from 'styled-components';
import { Heading, Text } from 'suomifi-ui-components';

export const SubTitle = styled(Text)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 16px;
  line-height: 24px;
`;

export const MainTitleWrapper = styled(Heading)`
  line-height: 52px;
`;

export const BadgeBarWrapper = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  line-height: 15px;
  margin-bottom: 20px;
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
`;

export const Badge = styled.span<{ $isValid?: boolean }>`
  line-height: 18px;
  border-radius: 10px;
  padding: 0 5px;
  background-color: ${(props) =>
    props.$isValid
      ? props.theme.suomifi.colors.successBase
      : props.theme.suomifi.colors.depthDark2};
  color: white;
  height: 18px;
  display: inline-block;
`;
