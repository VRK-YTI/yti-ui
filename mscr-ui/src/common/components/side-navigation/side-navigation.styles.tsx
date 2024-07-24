import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import {
  Heading,
  SideNavigation,
  SideNavigationItem
} from 'suomifi-ui-components';

export const SideNavigationWrapper = styled.aside<{ $breakpoint: Breakpoint; $isSidebarFolded: boolean }>`
  flex: 0 0 ${(props) => (props.$isSidebarFolded ? '70px' : '230px')};
  padding-left: ${(props) => props.theme.suomifi.spacing.m};
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};

  // Keep the white background in place when scrolling
  height: 100vh;
  position: sticky;
  top: 0;

  // Contain the expand/fold button
  display: flex;
  justify-content: space-between;

  transition: 0.6s;
  transition-timing-function: ease-in-out;
  //transition-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
  border-right: 3px solid ${(props) => props.theme.suomifi.colors.highlightLight2};

  && .sidebar-animate-fadein {
    animation: fadeInAnimation ease 1400ms;
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

export const MscrSideNavigation = styled(SideNavigation)<{ $isSidebarFolded: boolean }>`
  // Remove line and heading from above navigation
  .fi-side-navigation_divider, && .fi-side-navigation_heading {
    display: none;
  }
  nav {
    position: fixed;
    // Remove the height of the header banner
    height: calc(100vh - 1rem*60/18);
    width: ${(props) => (props.$isSidebarFolded ? '57px' : '217px')};
    transition: 0.6s;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.suomifi.colors.depthDark2} ${(props) => props.theme.suomifi.colors.highlightLight2};
  }
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
    margin: 0 0 0 ${(props) => props.theme.suomifi.spacing.xs};
    padding: 0 0 ${(props) => props.theme.suomifi.spacing.xxs} 0;
    // The decorative line next to group names
    border-left: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
  }
  && > span > .fi-icon {
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
    && h3, && .fi-icon {
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
    }
    // Above was defined a 'mask' covering the bottom half of the decorative line on the last group in the list
    // This is to remove the mask if the group is open
    &:before {
      display: none;
    }
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

export const GroupButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;

  // The caret
  &&& .fi-icon {
    width: 20px;
    height: 20px;
    flex-grow: 0;
    flex-shrink: 0;
    margin: auto 0;
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
  }
  &&&.collapsed .fi-icon {
    width: 12px;
  }

  && h3 {
    font-size: 16px;
    // unselected group color override
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
    margin-left: ${(props) => props.theme.suomifi.spacing.s};
  }
  &&.collapsed h3 {
    font-size: 14px;
    margin-left: ${(props) => props.theme.suomifi.spacing.xxs};
  }

  &:hover h3, &&:hover .fi-icon {
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
  &&.collapsed::before {
    top: 40%;
  }
`;

export const ExpanderButton = styled.button`
  border: none;
  padding: 0 2px 0 3px;
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  cursor: pointer;
`;

export const ExpanderIcon = styled.div`
  height: 40px;
  width: 2px;
  border-left: solid 3px ${(props) => props.theme.suomifi.colors.highlightLight2};
  border-right: solid 3px ${(props) => props.theme.suomifi.colors.highlightLight2};
`;

export const CollapsedNavigationWrapper = styled.nav`
  margin-top: ${(props) => props.theme.suomifi.spacing.m};
`;

export const PersonalNavButton = styled.button`
  height: 36px;
  width: 36px;
  box-sizing: border-box;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.theme.suomifi.colors.highlightLight2};
  p {
    color: ${(props) => props.theme.suomifi.colors.highlightBase};
    font-weight: bold;
    font-size: 22px;
    margin: 0;
  }
  svg {
    font-size: 16px;
  }
  padding: 2px 0 2px 2px;
`;

export const GroupNavIcon = styled.div`
  height: 36px;
  width: 36px;
  border-radius: 4px;
  box-sizing: border-box;
  border: none;
  background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
  padding-left: ${(props) => props.theme.suomifi.spacing.xs};
  p {
    color: ${(props) => props.theme.suomifi.colors.blackBase};
    font-weight: bold;
    font-size: 24px;
  }
`;

export const CollapsedGroupList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  // Again, the 'mask' to hide the bottom part of the gray border on the left when it's the last group in the list
  && > li:last-child::before {
    content: "";
    width:5px;
    height:50%;
    background-color:white;
    position: absolute;
    left:-1px;
    bottom:-1px;
  }
`;

export const CollapsedGroupItem = styled.li`
  position: relative;
  margin-left: ${(props) => props.theme.suomifi.spacing.xxs};
  padding: ${(props) => props.theme.suomifi.spacing.xxs} 0;
  // The decorative line next to group names
  border-left: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
`;
