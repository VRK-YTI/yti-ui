import React from 'react';
import { Icon } from 'suomifi-ui-components';
import { SidebarLinkListItemWrapper } from './sidebar.styles';

export interface SidebarLinkListItemProps {
  children: React.ReactNode;
}

export default function SidebarLinkListItem({
  children,
}: SidebarLinkListItemProps) {
  return (
    <SidebarLinkListItemWrapper>
      <Icon icon="linkList" />
      {children}
    </SidebarLinkListItemWrapper>
  );
}
