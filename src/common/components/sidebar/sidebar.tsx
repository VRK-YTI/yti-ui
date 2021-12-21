import React from 'react';
import { useBreakpoints } from '../media-query/media-query-context';
import { SidebarWrapper } from './sidebar.styles';

export interface SidebarProps {
  children: React.ReactNode;
};

export default function Sidebar({ children }: SidebarProps) {
  const { breakpoint } = useBreakpoints();

  return (
    <SidebarWrapper breakpoint={breakpoint}>
      {children}
    </SidebarWrapper>
  );
}
