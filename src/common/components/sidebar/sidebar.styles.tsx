import styled from "styled-components";
import { Breakpoint } from "../media-query/media-query-context";
import { small } from "../media-query/styled-helpers";

export const SidebarWrapper = styled.aside<{ breakpoint: Breakpoint }>`
  flex-grow: 1;
  background-color: ${(props) => props.theme.suomifi.colors.depthSecondary};
  max-width: ${(props) => small(props.breakpoint, "100%", "374px")};
  padding: ${(props) => props.theme.suomifi.spacing.m};

  &[aria-hidden="true"] {
    padding: 0;
  }
`;

export const SidebarHeader = styled.h2`
  color: ${(props) => props.theme.suomifi.colors.blackBase};
  font-size: 22px;
  font-weight: 600;
  line-height: 28px;
  margin: 0;
  margin-top: 9px;
`;

export const SidebarSubHeader = styled.h3`
  color: ${(props) => props.theme.suomifi.colors.blackBase};
  font-size: ${(props) => props.theme.suomifi.typography.bodyText};
  font-weight: 600;
  line-height: 24px;
  margin: 0;
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const SidebarLinkList = styled.ul`
  list-style: none;
  margin: ${(props) => props.theme.suomifi.spacing.xs} 0;
  padding: 0;
`;

export const SidebarLinkListItemWrapper = styled.li`
  display: flex;
  align-items: flex-start;

  :not(:last-child) {
    margin-bottom: 3px;
  }

  svg {
    color: ${(props) => props.theme.suomifi.colors.accentBase};
    padding: ${(props) => props.theme.suomifi.spacing.insetXs};
    padding-left: 0;
    flex-shrink: 0;
  }

  * {
    font-size: ${(props) => props.theme.suomifi.typography.bodyTextSmall};
    font-weight: 400;
    line-height: 24px;
  }
`;
