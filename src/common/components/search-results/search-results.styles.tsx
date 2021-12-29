import styled from 'styled-components';
import { Heading, Icon, Link, StaticChip, Text } from 'suomifi-ui-components';
import { CardChipProps, SeachCountTagsProps } from './search-count-tags.props';

export const Card = styled.div`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-bottom: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  display: flex;
  flex-direction: column;
  padding: ${props => props.theme.suomifi.spacing.m};
`;

export const CardChip = styled(StaticChip)<CardChipProps>`
  background-color: ${props => props.valid ? 'hsl(166, 90%, 30%)' : props.theme.suomifi.colors.depthDark1} !important;
  font-size: 12px;
  line-height: 0;
  padding: 0px 5px !important;
  text-transform: uppercase;
  vertical-align: bottom;
  width: min-content;
`;

export const CardContributor = styled(Text)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 14px;
  margin-bottom: ${props => props.theme.suomifi.spacing.xxs};
`;

export const CardDescription = styled(Text)`

`;

export const CardInfoDomain = styled(Text)`
  margin-top: ${props => props.theme.suomifi.spacing.s};
`;

export const CardPill = styled(Text)<SeachCountTagsProps>`
  border-radius: 25px;
  background-color: ${props => props.valid ? 'hsl(166, 90%, 30%)' : props.theme.suomifi.colors.depthDark1};
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  font-size: 12px;
  font-weight: 600;
  padding-left: ${props => props.theme.suomifi.spacing.xxs};
  padding-right: ${props => props.theme.suomifi.spacing.xxs};
  text-transform: uppercase;
  width: max-content;
`;

export const CardSubtitle = styled(Text)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: ${props => props.theme.suomifi.spacing.xxs};
  margin-bottom: ${props => props.theme.suomifi.spacing.xs};
`;

export const CardTitle = styled(Heading)`
  color: inherit;
`;

export const CardTitleWrapper = styled.div`
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  margin-bottom: ${props => props.theme.suomifi.spacing.xxs};
`;

export const CardTitleIcon = styled(Icon)`
  height: 20px;
  length: 20px;
`;

export const CardTitleLink = styled(Link)`
  align-items: center;
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  display: flex;
  font-size: 22px;
  font-weight: 600;
  gap: ${props => props.theme.suomifi.spacing.xs};
`;

export const CardWrapper = styled.div`
  border-top: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-right: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  border-left: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
`;
