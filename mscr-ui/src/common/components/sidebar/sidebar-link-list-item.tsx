import React from 'react';

import { SidebarLinkListItemWrapper } from './sidebar.styles';

export interface SidebarLinkListItemProps {
  children: React.ReactNode;
}

export default function SidebarLinkListItem({
  children,
}: SidebarLinkListItemProps) {
  return <SidebarLinkListItemWrapper>{children}</SidebarLinkListItemWrapper>;
}
