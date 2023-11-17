import styled from 'styled-components';
import { Block, Heading, Link, Paragraph } from 'suomifi-ui-components';

export const CardBlock = styled(Block)`
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
`;

export const Extra = styled(Block)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const OrganizationParagraph = styled(Paragraph)`
  color: ${(props) => props.theme.suomifi.colors.depthDark1};
  font-size: 14px;
`;

export const Title = styled(Heading)`
  color: inherit;
  font-size: 22px !important;
`;

export const TitleLink = styled(Link)`
  color: ${(props) => props.theme.suomifi.colors.highlightBase};
  display: flex;
  font-size: 22px;
  font-weight: 600;
  gap: ${(props) => props.theme.suomifi.spacing.xs};

  > svg {
    padding-top: 6px;
  }

  .fi-icon {
    min-width: max-content;
  }

  &:visited {
    h2 {
      color: ${(props) => props.theme.suomifi.colors.accentTertiaryDark1};
    }
  }
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
