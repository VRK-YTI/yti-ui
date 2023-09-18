import styled from 'styled-components';
import { Heading, Text } from 'suomifi-ui-components';

export const SubTitle = styled(Text)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 16px;
  line-height: 24px;
`;

export const MainTitleWrapper = styled(Heading)`
  line-height: 52px;
  margin-bottom: 5px;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const BadgeBarWrapper = styled.div<{
  $larger?: boolean;
  $smBottom?: boolean;
}>`
  font-size: ${(props) => (props.$larger ? '14px' : '12px')};
  text-transform: uppercase;
  font-weight: 600;
  line-height: 15px;
  margin-bottom: ${(props) => (props.$smBottom ? '0' : '20px')};
  color: ${(props) => props.theme.suomifi.colors.depthDark1};

  > span:last-child {
    font-size: 12px;
  }

  display: flex;
  align-items: center;
  gap: 5px;

  svg {
    height: 20px !important;
    width: 20px !important;
  }
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
