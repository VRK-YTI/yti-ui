import styled from 'styled-components';
import { Breakpoint } from 'yti-common-ui/media-query';
import { small } from 'yti-common-ui/media-query/styled-helpers';
import {
  Heading,
  RouterLink,
  SideNavigation,
  SideNavigationItem,
} from 'suomifi-ui-components';

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
    color: #6b6b6b;
    font-size: 1rem;
  }
`;

export const MscrSideNavigationLevel2 = styled(SideNavigationItem)`
  & {
    background-color: #EAF2FA;
  },
  .fi-icon {
    display: none;
  },
  .span {
    color: yellow;
  }
`;

export const MscrSideNavigationLevel3 = styled(SideNavigationItem)`
&&&& a {
  color: black;
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
  padding: 1em;
`;
