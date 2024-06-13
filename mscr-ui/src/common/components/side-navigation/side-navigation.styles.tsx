import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';
import {
  Heading,
  SideNavigation,
  SideNavigationItem,
} from 'suomifi-ui-components';

export const SideNavigationWrapper = styled.aside<{ $breakpoint: Breakpoint,  $isSidebarFolded: boolean }>`
  // Width and positioning for now, need adjusting when overall layout structure is decided
  flex-grow: 1;
  width: 100%;
  max-width: ${(props) => small(props.$breakpoint, '100%', '374px')};
  width: ${(props) => (props.$isSidebarFolded ? '50px' : '100%')};
  left: 0;
  top: 76px;
  background-color: white;
  padding-left: ${(props) => props.theme.suomifi.spacing.m};
  padding-top: ${(props) => props.theme.suomifi.spacing.m};
  padding-bottom: ${(props) => props.theme.suomifi.spacing.m};
  margin-right: ${(props) => props.theme.suomifi.spacing.m};
  height: 100vh;
  transition: 0.6s;
  transition-timing-function: ease-in-out;
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  border-right: 3px solid ${(props) => props.theme.suomifi.colors.highlightLight3};
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
  // Remove line from above navigation
  .fi-side-navigation_divider {
    display: none;
  }
  height: 100vh;
  ul {padding: 1px !important;}
`;

export const MscrSideNavigationLevel1 = styled(SideNavigationItem)`
  // When the personal navigation subsection is active, there's a blue background and non-selected links are black
  &.fi-side-navigation-item--child-selected {
    div {
      background-color: ${(props) =>
        props.theme.suomifi.colors.highlightLight3};
    }
    && .personal a.fi-link--router {
      color: ${(props) => props.theme.suomifi.colors.blackBase};
    }
  }
`;

export const MscrSideNavigationLevel2 = styled(SideNavigationItem)`
  && {
    margin-right: ${(props) => props.theme.suomifi.spacing.m};
  }
  // Remove arrow icon from group buttons
  .fi-icon {
    display: none;
  }
  // Group subsection background is white until a link is selected
  && .fi-side-navigation-item_sub-list {
    background-color: transparent;
  }
  // When the group navigation subsection is active, there's a blue background and non-selected links are black
  &.fi-side-navigation-item--child-selected {
    background-color: ${(props) => props.theme.suomifi.colors.highlightLight3};
    && .group a.fi-link--router {
      color: ${(props) => props.theme.suomifi.colors.blackBase};
    }
  }
`;

export const MscrSideNavigationLevel3 = styled(SideNavigationItem)`
  // Links in inactive sections are gray
  &&&& a {
    color: ${(props) => props.theme.suomifi.colors.depthDark2};
    ${(props) => props.theme.suomifi.typography.actionElementInnerTextBold}
  }
  // Currently selected link is blue and has a blue left border
  &.fi-side-navigation-item--selected {
    border-left: solid 3px
      ${(props) => props.theme.suomifi.colors.highlightBase};
    &&& .fi-link--router {
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
    }
  }
  &&&&& .fi-link--router {
    // override suomifi default blue background
    background-color: transparent;
    // Hovered link is blue
    &:hover {
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
    }
  }
`;

export const PersonalNavigationWrapper = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`;

export const GroupOpenButton = styled.button`
  &&&&& {
    // override suomifi default blue background
    background-color: transparent;
  }
  // Hovered group name is blue
  &:hover h3 {
    color: ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;

export const GroupOpenBtn = styled.div`
  &&&&& {
    // override suomifi default blue background
    background-color: transparent;
  }
  // Hovered group name is blue
  &:hover h3 {
    color: ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;

export const FoldButtonWrapper = styled.div`
  width: 20px;
  z-index: 0;
  margin-left: -75px;
`;

export const FoldButton = styled.div`
  height: 30px;
  width: 20px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  div {
    width: 3px;
    height: 30px;
    margin-left: 2px;
    background: ${(props) => props.theme.suomifi.colors.highlightLight2};
  }
`;
