import styled from 'styled-components';
import { StaticChip, Text } from 'suomifi-ui-components';
import { TitleProps } from './title.props';

export const Contributor = styled(Text)`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.xs};
`;

export const Description = styled(Text)`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const StatusChip = styled(StaticChip)<TitleProps>`
  background-color: ${(props) =>
    props.valid
      ? 'hsl(166, 90%, 30%)'
      : props.theme.suomifi.colors.depthDark1} !important;
  font-size: 12px;
  line-height: 0;
  margin-top: ${(props) => props.theme.suomifi.spacing.xxs};
  padding: 0px 10px !important;
  text-transform: uppercase;
  align-self: start;
`;

export const TitleDescriptionWrapper = styled.div<{ isSmall: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isSmall ? 'column' : 'row')};
  gap: 20px;
  justify-content: space-between;
  align-items: baseline;
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleWrapperNoBreadcrumb = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 18px;
`;
