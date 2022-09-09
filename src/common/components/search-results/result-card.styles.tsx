import styled from 'styled-components';
import {
  Block,
  Heading,
  Link,
  Paragraph,
  StaticChip,
} from 'suomifi-ui-components';
import { CardChipProps } from './search-count-tags.props';

export const CardBlock = styled(Block)`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
`;

export const Extra = styled(Block)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const OrganizationParagraph = styled(Paragraph)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

export const Title = styled(Heading)`
  color: inherit;
  font-size: 22px !important;
`;

export const TitleLink = styled(Link)`
  align-items: center;
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  display: flex;
  font-size: 22px;
  font-weight: 600;
  gap: ${(props) => props.theme.suomifi.spacing.xs};
`;

export const Subtitle = styled.p`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: ${(props) => props.theme.suomifi.spacing.xxs};
  margin: 0 0 ${(props) => props.theme.suomifi.spacing.xs} 0;
  text-transform: uppercase;
`;

export const Description = styled.p`
  margin: 0;
  max-height: 85px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const PartOf = styled.p`
  margin: ${(props) => props.theme.suomifi.spacing.xs} 0 0 0;
`;

export const Status = styled(StaticChip)<CardChipProps>`
  background-color: ${(props) =>
    props.valid
      ? 'hsl(166, 90%, 30%)'
      : props.theme.suomifi.colors.depthDark1} !important;
  font-size: 12px;
  line-height: 0;
  padding: 0px 5px !important;
  text-transform: uppercase;
  vertical-align: bottom;
`;
