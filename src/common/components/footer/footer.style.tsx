import styled from "styled-components";
import { Breakpoint } from "../media-query/media-query-context";
import { small } from "../media-query/styled-helpers";

export const FooterContentWrapper = styled.div`
  padding: ${(props) => props.theme.suomifi.spacing.m} 0px;
  border-bottom: ${(props) =>
    `1px solid ${props.theme.suomifi.colors.depthLight1}`};
  span {
    display: inline-block;
    padding-top: ${(props) => props.theme.suomifi.spacing.xs};
  }
`;

export const FooterLinkWrapper = styled.div<{ breakpoint: Breakpoint }>`
  display: flex;
  padding: ${(props) => props.theme.suomifi.spacing.m} 0;
  column-gap: ${(props) => props.theme.suomifi.spacing.xxl};
  row-gap: 18px;
  justify-content: flex-start;
  flex-wrap: wrap;
  flex-direction: ${(props) => small(props.breakpoint, "column", "row")};
`;

export const VersionInfo = styled.div`
  color: ${(props) => props.theme.suomifi.colors.whiteBase};
  font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};
  justify-content: center;
  display: flex;
`;
