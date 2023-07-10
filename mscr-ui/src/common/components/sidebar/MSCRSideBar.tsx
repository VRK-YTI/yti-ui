import {
  Sidebar,
  SidebarHeader,
  SidebarLinkList,
  SidebarLinkListItem,
  SidebarSubHeader,
} from '../sidebar';
import { User } from 'yti-common-ui/interfaces/user.interface';

export default function MSCRSideBar({ user }: { user?: User }) {
  return (
    <Sidebar>
      <SidebarHeader>Personal workspace</SidebarHeader>
      <SidebarLinkList>
        <SidebarLinkListItem>Personal thing</SidebarLinkListItem>
      </SidebarLinkList>

      <SidebarHeader>Group workspace</SidebarHeader>
      <SidebarLinkList>Group thing</SidebarLinkList>
    </Sidebar>
  );
}
