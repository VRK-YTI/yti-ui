import {
  RouterLink,
  SideNavigation,
  SideNavigationItem,
} from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/media-query';
import { SideNavigationWrapper } from './side-navigation.styles';

export default function SideNavigationPanel({}) {
  const { breakpoint } = useBreakpoints();
  return (
    <SideNavigationWrapper $breakpoint={breakpoint} id="sidebar">
      <SideNavigation heading="Workspaces" aria-label="Main">
        <SideNavigationItem
          subLevel={1}
          content={<RouterLink href="/">Personal workspace</RouterLink>}
        >
          <SideNavigationItem
            subLevel={2}
            selected
            content={<RouterLink href="/">Tim's workspace</RouterLink>}
          >
            <SideNavigationItem
              subLevel={3}
              content={<RouterLink href="/">Workspace content</RouterLink>}
            />
            <SideNavigationItem
              subLevel={3}
              content={<RouterLink href="/">Workspace settings</RouterLink>}
            />
          </SideNavigationItem>
        </SideNavigationItem>
        <SideNavigationItem
          subLevel={1}
          content={<RouterLink href="/">Group workspace</RouterLink>}
        >
          <SideNavigationItem
            subLevel={2}
            content={<RouterLink href="/">Dilligent professionals</RouterLink>}
          />
          <SideNavigationItem
            subLevel={2}
            content={<RouterLink href="/">Science 4 ever</RouterLink>}
          />
        </SideNavigationItem>
      </SideNavigation>
    </SideNavigationWrapper>
  );
}
