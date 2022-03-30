import styled from 'styled-components';
import { Breakpoint } from '@app/common/components/media-query/media-query-context';
import { small } from '@app/common/components/media-query/styled-helpers';

export const FooterContentWrapper = styled.div`
  padding: 15px 0px 15px 0px;
  border-bottom: ${(props) =>
    `2px solid ${props.theme.suomifi.colors.depthLight2}`};
  span {
    display: inline-block;
    padding-top: ${(props) => props.theme.suomifi.spacing.xs};
  }
`;

export const FooterLinkWrapper = styled.div<{ breakpoint: Breakpoint }>`
  display: flex;
  padding-top: ${(props) => props.theme.suomifi.spacing.xs};
  column-gap: ${(props) => props.theme.suomifi.spacing.xxl};
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: ${(props) => small(props.breakpoint, 'column', 'row')};
`;
