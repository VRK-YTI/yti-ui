import styled from 'styled-components';
import { Block, Heading, Link, StaticIcon } from 'suomifi-ui-components';

export const ErrorCard = styled(Block)<{ $isSmall: boolean }>`
  align-items: ${(props) =>
    props.$isSmall === true ? 'center' : 'flex-start'};
  background: ${(props) => props.theme.suomifi.colors.whiteBase};
  border: 1px solid ${(props) => props.theme.suomifi.colors.depthLight1};
  display: flex;
  flex-direction: ${(props) => (props.$isSmall === true ? 'column' : 'row')};
  gap: 25px;
  margin-bottom: ${(props) => props.theme.suomifi.spacing.m};
  margin-top: 20px;
  padding: ${(props) =>
    props.$isSmall === true ? '25px 35px' : '25px 75px 35px 30px'};
  width: 1110px;
`;

export const ErrorIcon = styled(StaticIcon)`
  min-height: 80px;
  min-width: 80px;
`;

export const ParagraphTitle = styled(Heading)`
  font-size: 18px !important;
`;

export const HomePageLink = styled(Link)`
  font-size: 16px;
`;

export const TextBlock = styled(Block)`
  > div:not(:last-child) {
    margin-bottom: 20px;
  }
`;
