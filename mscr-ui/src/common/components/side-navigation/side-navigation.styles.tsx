import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';
import {
  Button,
  Heading,
  SideNavigation,
  SideNavigationItem
} from 'suomifi-ui-components';

export const SideNavigationWrapper = styled.aside<{ $breakpoint: Breakpoint; $isSidebarFolded: boolean }>`
  // Width and positioning for now, need adjusting when overall layout structure is decided
  flex-grow: 1;
  max-width: ${(props) => small(props.$breakpoint, '100%', '374px')};
  width: ${(props) => (props.$isSidebarFolded ? '50px' : '100%')};
  left: 0;
  top: 76px;
  background-color: white;
  padding-left: ${(props) => props.theme.suomifi.spacing.m};
  padding-bottom: ${(props) => props.theme.suomifi.spacing.m};
  margin-right: ${(props) => props.theme.suomifi.spacing.m};
  height: 100vh;
  transition: 0.6s;
  transition-timing-function: ease-in-out;
  transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  border-right: 3px solid ${(props) => props.theme.suomifi.colors.highlightLight3};

  && .sidebar-animate-fadein {
    animation: fadeInAnimation ease 1700ms;
    animation-iteration-count: 1;
    animation-fill-mode: both;
  }

  && .sidebar-animate-fadeout {
    animation: fadeOutAnimation ease 400ms;
    animation-iteration-count: 1;
    animation-fill-mode: both;
  }
`;

// Modify the style of an existing suomifi component
export const NavigationHeading = styled(Heading)`
  // Adding &-characters increases the specificity so you can override styles
  && {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: normal;
  }
`;

export const MscrSideNavigation = styled(SideNavigation)`
  // Remove line from above navigation
  .fi-side-navigation_divider {
    display: none;
  }
  height: 100vh;
`;

export const MscrSideNavigationLevel1 = styled(SideNavigationItem)`
  // A 'mask' to hide the bottom part of the gray border on the left when it's the last group in the list
  & > ul > li:last-child::before {
    content: "";
    width:5px;
    height:50%;
    background-color:white;
    position: absolute;
    left:-1px;
    bottom:-1px;
  }
`;

export const MscrSideNavigationLevel2 = styled(SideNavigationItem)`
  &&& {
    margin: 0 ${(props) => props.theme.suomifi.spacing.s};
    // The decorative line next to group names
    border-left: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  }
  .fi-icon {
    // Remove arrow icon from group buttons
    display: none;
  }
  && .fi-side-navigation-item_sub-list {
    padding: 0;
    margin-top: 0;
    // Group subsection background is white
    background-color: transparent;
  }

  &.fi-side-navigation-item--child-selected, &.group-selected {
    // Opened group name is highlight blue
    && h3 {
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
    }
    // Above was defined a 'mask' covering the bottom half of the decorative line on the last group in the list
    // This is to remove the mask if the group is open
    &:before {
      display: none;
    }
  }

  && h3 {
    margin-left: ${(props) => props.theme.suomifi.spacing.xs};
  }
`;

export const MscrSideNavigationLevel3 = styled(SideNavigationItem)`
  margin: 0;

  &&&& a {
    font-size: 16px;
    font-weight: 600;
    margin: ${(props) => props.theme.suomifi.spacing.xxs} ${(props) => props.theme.suomifi.spacing.xs};
    padding: 0 ${(props) => props.theme.suomifi.spacing.xs};
    // Links in inactive sections are gray
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
    // leave room for highlight border
    border-left: solid 3px transparent;
    // override suomifi default blue background
    background-color: transparent;
    // Hovered link is blue
    &:hover {
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
    }
  }
  &&&&&.fi-side-navigation-item--selected a {
    // Currently selected link is blue and has a blue left border
    color: ${(props) => props.theme.suomifi.colors.highlightBase};
    border-left: solid 3px
      ${(props) => props.theme.suomifi.colors.highlightBase};
  }
`;

export const PersonalNavigationWrapper = styled.div`
  margin-left: 20px;
  margin-right: 20px;
`;

export const GroupOpenButton = styled(Button)`
  &&&&& {
    padding: ${(props) => props.theme.suomifi.spacing.xxs} ${(props) => props.theme.suomifi.spacing.xs};
    // override suomifi button defaults
    background: none;
    text-shadow: none;
    border: none;
  }
  && h3 {
    font-size: 16px;
    // unselected link color override
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
  }
  &:hover h3 {
    // Hovered group name is highlight blue
    color: ${(props) => props.theme.suomifi.colors.highlightBase};
  }
  &&::before {
    // This is the little dot on the decorative line next to group names
    content: '';
    box-sizing: unset;
    position: absolute;
    top: 45%;
    left: -5px;
    height: 5px;
    width: 5px;
    background-color: ${(props) => props.theme.suomifi.colors.depthBase};
    border-radius: 50%;
    border: solid 2px white;
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
