import styled from 'styled-components';
import { Text } from 'suomifi-ui-components';
import { TitleProps } from './title.props';

export const Contributor = styled(Text)`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
`;

export const Description = styled(Text)`
  margin-top: 20px;
`;

export const StatusPill = styled(Text)<TitleProps>`
  align-items: center;
  border-radius: 25px;
  background-color: ${props => props.valid ? 'hsl(166, 90%, 30%)' : props.theme.suomifi.colors.depthBase};
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  display: flex;
  font-size: 12px;
  font-weight: 600;
  margin-top: 5px;
  padding-left: 10px;
  padding-right: 10px;
  width: max-content;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
