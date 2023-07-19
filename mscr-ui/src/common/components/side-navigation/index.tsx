import { Link as MUILink } from '@mui/material';
import Link from 'next/link';
import {
  RouterLink,
  SideNavigation,
  SideNavigationItem,
} from 'suomifi-ui-components';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { SideNavigationWrapper } from './side-navigation.styles';

export default function SideNavigationPanel({ user }: { user?: User }) {
  const { breakpoint } = useBreakpoints();
  return (
    <SideNavigationWrapper $breakpoint={breakpoint} id="sidebar">
      <SideNavigation
        heading="Workspaces"
        aria-label="Main"
        variant="smallScreen"
      >
        <SideNavigationItem
          subLevel={1}
          expanded
          content={<Link href="/personal-home">Personal workspace</Link>}
        >
          <SideNavigationItem
            subLevel={2}
            expanded
            content={
              <MUILink href="/personal-home">
                {user?.firstName}'s workspace
              </MUILink>
            }
          >
            <SideNavigationItem
              subLevel={3}
              content={
                <RouterLink href="/personal-home">Workspace content</RouterLink>
              }
            />
            <SideNavigationItem
              subLevel={3}
              content={
                <RouterLink href="/personal-home">
                  Workspace settings
                </RouterLink>
              }
            />
          </SideNavigationItem>
        </SideNavigationItem>
        <SideNavigationItem
          subLevel={1}
          expanded
          content={<RouterLink href="/group-home">Group workspace</RouterLink>}
        >
          <SideNavigationItem
            subLevel={2}
            expanded
            content={
              <RouterLink href="/group-home">
                Dilligent professionals
              </RouterLink>
            }
          />
          <SideNavigationItem
            subLevel={2}
            expanded
            content={<RouterLink href="/group-home">Science 4 ever</RouterLink>}
          />
        </SideNavigationItem>
      </SideNavigation>
    </SideNavigationWrapper>
  );
}
