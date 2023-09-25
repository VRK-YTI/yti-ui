import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';
import {
  Heading, SideNavigation,
  SideNavigationItem,
} from 'suomifi-ui-components';
import {
  suomifiDesignTokens,
  DesignTokens,
  TypographyToken
} from 'suomifi-design-tokens';

// Suomifi design system tokens
// Colors:
const navigationHeadingColor = suomifiDesignTokens.colors.depthDark2;
const hoverAndSelectedFontColor = suomifiDesignTokens.colors.highlightBase;
const selectedBackgroundColor = suomifiDesignTokens.colors.highlightLight3;
// Typography:
const groupHeadingFont = suomifiDesignTokens.typography.leadTextSmallScreen;
const navigationLevel3Font = suomifiDesignTokens.typography.actionElementInnerTextBold;

export const SideNavigationWrapper = styled.aside<{ $breakpoint: Breakpoint }>`
  flex-grow: 1;
  width: 25%;
  background-color: white;
  // background-color: ${(props) => props.theme.suomifi.colors.depthSecondary};
  max-width: ${(props) => small(props.$breakpoint, '100%', '374px')};
  padding: ${(props) => props.theme.suomifi.spacing.m};
`;

// Modify the style of an existing suomifi component
export const NavigationHeading = styled(Heading)`
  // Adding &-characters increases the specificity so you can override styles
  && {
    color: ${navigationHeadingColor};
    font-size: 16px;
  }
`;

export const GroupHeading = styled(Heading)`
  && {
    color: #212121;
    ${groupHeadingFont};
  }
`;

export const MscrSideNavigation = styled(SideNavigation)`
  .fi-side-navigation_divider {
    display: none;
  }
  .fi-side-navigation-item--selected {
    background-color: ${selectedBackgroundColor};
  }
`;

export const MscrSideNavigationLevel2 = styled(SideNavigationItem)`
  .fi-icon {
    display: none;
  }
`;

export const MscrSideNavigationLevel3 = styled(SideNavigationItem)`
  &&&& a {
    color: black;
    ${navigationLevel3Font}
  }
  &.fi-side-navigation-item--selected {
    border-left: solid .2rem #2a6ebb;
    && .fi-link--router {
      color: #2a6ebb;
    }
  }
  &&&& .fi-link--router {
    background-color: transparent;
  }
`;

export const PersonalNavigationWrapper = styled.div`
  background-color: #EAF2FA;
  margin-left: 30px;
`;

export const GroupOpenButton = styled.button`
  &&&&& {
    background-color: transparent;
  }
  &:hover h3 {
    color: ${hoverAndSelectedFontColor};
  }
`;
