import React from 'react';
import { IconLinkList } from 'suomifi-ui-components';
import { SidebarLinkListItemWrapper } from './sidebar.styles';

export interface SidebarLinkListItemProps {
  children: React.ReactNode;
}

export default function SidebarLinkListItem({
  children,
}: SidebarLinkListItemProps) {
  return (
    <SidebarLinkListItemWrapper>
      <IconLinkList />
      {children}
    </SidebarLinkListItemWrapper>
  );
}
