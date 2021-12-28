import styled from 'styled-components';
import { Icon, Text } from 'suomifi-ui-components';

export const CountPill = styled(Text)`
  align-items: center;
  border-radius: 25px;
  background-color: ${(props) => props.theme.suomifi.colors.highlightBase};
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  display: flex;
  font-size: ${props => props.theme.suomifi.values.typography.bodyTextSmall.fontSize.value}px;
  font-weight: 600;
  gap: 8px;
  padding-left: 10px;
  padding-right: 10px;
  width: max-content;
`;

export const CountPillIcon = styled(Icon)`
  padding: 0px;
  margin: 0px;

  :hover {
    cursor: pointer;
  }
`;

export const CountPillWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CountText = styled(Text)`
  font-weight: 600;
`;

export const CountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
`;
