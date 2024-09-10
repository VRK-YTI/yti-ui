import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import {
  ActionMenu,
  Heading,
  SideNavigation,
  SideNavigationItem
} from 'suomifi-ui-components';

export const SideNavigationWrapper = styled.div<{ $breakpoint: Breakpoint; $isSidebarMinimized: boolean }>`
  // Breakpoint isn't in use, but could be used for responsiveness

  padding-left: 16px;
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  border-right: 3px solid ${(props) => props.theme.suomifi.colors.highlightLight2};

  // Keep the white background in place when scrolling
  height: 100vh;
  position: sticky;
  top: 0;

  // Contain the expand/minimize button
  display: flex;
  justify-content: space-between;

  // Change the width with an animation (width with padding 90px/250px)
  flex: 0 0 ${(props) => (props.$isSidebarMinimized ? '74px' : '234px')};
  transition: 0.6s;
  transition-timing-function: ease-in-out;

  // Animations for the content switching between expanded and minimized
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

export const MscrSideNavigation = styled(SideNavigation)`
  // Remove line and heading from above navigation
  .fi-side-navigation_divider, && .fi-side-navigation_heading {
    display: none;
  }
  nav {
    position: sticky;
    // Remove the height of the header banner
    height: calc(100vh - 1rem*60/18);
    width: 222px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${(props) => props.theme.suomifi.colors.depthDark2} ${(props) => props.theme.suomifi.colors.highlightLight2};
  }
`;

export const MscrSideNavigationLevel1 = styled(SideNavigationItem)`
  padding-right: 4px;
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
    // Group subsection background override
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
    font-weight: bold;
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

  && h3 {
    font-size: 16px;
    // unselected group color override
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
    margin-left: ${(props) => props.theme.suomifi.spacing.s};
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
`;

export const ExpanderButton = styled.button`
  border: none;
  padding: 0 2px 0 1px;
  background-color: ${(props) => props.theme.suomifi.colors.whiteBase};
  cursor: pointer;
`;

export const ExpanderIcon = styled.div`
  height: 40px;
  width: 2px;
  border-left: solid 3px ${(props) => props.theme.suomifi.colors.highlightLight2};
  border-right: solid 3px ${(props) => props.theme.suomifi.colors.highlightLight2};
`;

export const MinimizedNavigationWrapper = styled.nav`
  box-sizing: border-box;
  padding-top: ${(props) => props.theme.suomifi.spacing.m};
  padding-bottom: ${(props) => props.theme.suomifi.spacing.s};
  padding-right: 4px;
  // Same stuff as with the expanded navigation
  position: sticky;
  height: calc(100vh - 1rem*60/18);
  width: 62px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${(props) => props.theme.suomifi.colors.depthDark2} ${(props) => props.theme.suomifi.colors.highlightLight2};
`;

export const PopoverNavigationMenu = styled(ActionMenu)`
  position: relative;
  &&.personal > button {
    // Styling of the P button in minimized navigation
    height: 36px;
    width: 36px;
    box-sizing: border-box;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background-color: ${(props) => props.theme.suomifi.colors.highlightLight2};
    color: ${(props) => props.theme.suomifi.colors.highlightBase};
    font-weight: bold;
    font-size: 24px;
    position: relative;
    .fi-icon {
      font-size: 16px;
      position: absolute;
      left: 10px;
      top: 15px;
    }
    padding: 0 12px 0 0;
    margin: 4px 0 0 4px;
  }
  &&.group > button {
    // Styling of the group list items in minimized navigation
    color: ${(props) => props.theme.suomifi.colors.depthDark1};
    border: none;
    cursor: pointer;
    padding: 1px 0 0 ${(props) => props.theme.suomifi.spacing.xs};
    width: 100%;
    text-align: justify;
    & > .fi-button_icon > .fi-icon {
      position: absolute;
      right: 0;
      top: 38%;
      width: 12px;
      margin: 0;
    }
    &:hover {
      background: none;
      color: ${(props) => props.theme.suomifi.colors.highlightBase};
    }
    &:focus {
      // Override positioning switch
      position: unset;
    }
    &:before {
      // This is the little dot on the decorative line next to group abbreviations
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
  }

  // Moving the popover to the right side instead of below
  // Positioning is set as inline style, so have to use !important
  & .fi-action-menu-popover {
    padding: 0;
    inset: unset !important;
    transform: translate(50px, -50px) !important;
  }
  &.group .fi-action-menu-popover {
    transform: translate(60px, -50px) !important;
  }
  && .fi-action-menu-popover_popper-arrow {
    // Rotate and correct position of the triangle that points to the opening button
    transform: translate(-18px, 20px) !important;
    &::before, &::after {
      transform: rotate(0.75turn);
      inset: 0;
    }
    &::after {
      left: 2px;
      top: 1px;
    }
  }

  // Make the whole menu button be the link
  & .fi-action-menu-item {
    padding: 0;
    a  {
      width: 90px;
      height: 36px;
      padding: 10px 0 0 15px;
    }
  }

  // Override link base styles
  & .fi-action-menu-item a {
    text-decoration: none;
    color: ${(props) => props.theme.suomifi.colors.blackBase};
  }
  & .fi-action-menu-item--selected a {
    color: ${(props) => props.theme.suomifi.colors.whiteBase};
  }
`;

export const GroupNavIcon = styled.div`
  // Styling of the G icon in minimized menu
  height: 36px;
  width: 36px;
  border-radius: 4px;
  box-sizing: border-box;
  border: none;
  background-color: ${(props) => props.theme.suomifi.colors.depthLight2};
  padding-left: ${(props) => props.theme.suomifi.spacing.xs};
  margin: 4px 0 0 4px;
  p {
    color: ${(props) => props.theme.suomifi.colors.blackBase};
    font-weight: bold;
    font-size: 24px;
  }
`;

export const MinimizedGroupList = styled.ul`
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

export const MinimizedGroupItem = styled.li`
  position: relative;
  margin-left: 8px;
  padding: ${(props) => props.theme.suomifi.spacing.xxs} 0 0 0;
  // The decorative line next to group names
  border-left: solid 1px ${(props) => props.theme.suomifi.colors.depthLight1};
`;
