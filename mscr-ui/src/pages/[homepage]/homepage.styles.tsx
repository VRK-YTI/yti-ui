import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';

export const TableAndSidebarWrapper = styled.aside<{ $breakpoint: Breakpoint }>`
  display: flex;
  //   flex-direction: row;
  // flex-grow: 2;

  //   background-color: ${(props) =>
    props.theme.suomifi.colors.depthSecondary};
  //   max-width: ${(props) => small(props.$breakpoint, '100%', '374px')};
  padding: ${(props) => props.theme.suomifi.spacing.m};
`;
