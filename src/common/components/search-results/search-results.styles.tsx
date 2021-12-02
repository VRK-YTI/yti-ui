import styled from 'styled-components';
import { Heading, Icon, Link, Text } from 'suomifi-ui-components';
import { SeachCountTagsProps } from './search-count-tags.props';

export const Card = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const CardContributor = styled(Text)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 14px;
`;

export const CardDescription = styled(Text)`

`;

export const CardInfoDomain = styled(Text)`
  margin-top: 15px;
`;

export const CardPill = styled(Text)<SeachCountTagsProps>`
  border-radius: 25px;
  background-color: ${props => props.valid ? 'hsl(166, 90%, 30%)' : props.theme.suomifi.colors.depthBase};
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  font-size: 12px;
  font-weight: 600;
  padding-left: 5px;
  padding-right: 5px;
  width: max-content;
`;

export const CardSubtitle = styled(Text)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
  word-spacing: 1px;
`;

export const CardTitle = styled(Heading)`
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  margin-bottom: 5px;
`;

export const CardTitleIcon = styled(Icon)`
  margin-right: 10px;
`;

export const CardTitleLink = styled(Link)`
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 5px;
`;

export const CardWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
`;
