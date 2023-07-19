import {
  Sidebar,
  SidebarHeader,
  SidebarLinkList,
  SidebarLinkListItem,
  SidebarSubHeader,
} from '../sidebar';
import { User } from 'yti-common-ui/interfaces/user.interface';
import { RouterLink } from 'suomifi-ui-components';

export default function MSCRSideBar({ user }: { user?: User }) {
  return (
    <Sidebar>
      <SidebarHeader>Schema browser</SidebarHeader>
      <SidebarLinkList>
        <SidebarLinkListItem>
          <RouterLink href="/">Personal thing</RouterLink>
        </SidebarLinkListItem>
      </SidebarLinkList>
    </Sidebar>
  );
}
