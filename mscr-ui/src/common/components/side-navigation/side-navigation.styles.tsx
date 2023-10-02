import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';
import {
  Heading,
  SideNavigation,
  SideNavigationItem
} from 'suomifi-ui-components';

export const SideNavigationWrapper = styled.aside<{ $breakpoint: Breakpoint }>`
  flex-grow: 1;
  width: 25%;
  position: fixed;
  left: 0;
  top: 76px;
  background-color: white;
  // Sync the width to the content margin
  max-width: ${(props) => small(props.$breakpoint, '100%', '374px')};
  padding: ${(props) => props.theme.suomifi.spacing.m};
`;

// Modify the style of an existing suomifi component
export const NavigationHeading = styled(Heading)`
  // Adding &-characters increases the specificity so you can override styles
  && {
    color: ${(props) => props.theme.suomifi.colors.depthDark2};
    font-size: 16px;
  }
`;

export const GroupHeading = styled(Heading)`
  && {
    color: ${(props) => props.theme.suomifi.colors.blackBase};
    ${(props) => props.theme.suomifi.typography.leadTextSmallScreen};
  }
`;

export const MscrSideNavigation = styled(SideNavigation)`
  .fi-side-navigation_divider {
    display: none;
  }
`;

export const MscrSideNavigationLevel1 = styled(SideNavigationItem)`
  &&&&&&&&&&&&&&&.fi-side-navigation-item--child-selected div {
    background-color: ${(props) => props.theme.suomifi.colors.highlightLight3};
  }
`;

export const MscrSideNavigationLevel2 = styled(SideNavigationItem)`
  .fi-icon {
    display: none;
  }
  && .fi-side-navigation-item_sub-list {
    background-color: transparent;
  }
  &.fi-side-navigation-item--child-selected {
    background-color: ${(props) => props.theme.suomifi.colors.highlightLight3};
  }
`;

export const MscrSideNavigationLevel3 = styled(SideNavigationItem)`
  &&&& a {
    color: ${(props) => props.theme.suomifi.colors.depthDark2};
    ${(props) => props.theme.suomifi.typography.actionElementInnerTextBold}
    .fi-side-navigation-item--selected ~ & {
      color: ${(props) => props.theme.suomifi.colors.blackBase};
    }
  }
  &.fi-side-navigation-item--selected {
    border-left: solid 3px ${(props) => props.theme.suomifi.colors.highlightBase};
    && .fi-link--router {
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
    }
  }
  &&&& .fi-link--router {
    background-color: transparent;
  }
`;

export const PersonalNavigationWrapper = styled.div`
  margin-left: 30px;
`;

export const GroupOpenButton = styled.button`
  &&&&& {
    background-color: transparent;
  }
  &:hover h3 {
    color: ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;
