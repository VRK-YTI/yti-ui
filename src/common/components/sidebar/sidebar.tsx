import React from "react";
import { useBreakpoints } from "../media-query/media-query-context";
import { SidebarWrapper } from "./sidebar.styles";

export interface SidebarProps {
  children: React.ReactNode;
  isEmpty?: boolean;
}

export default function Sidebar({ children, isEmpty }: SidebarProps) {
  const { breakpoint } = useBreakpoints();

  return (
    <SidebarWrapper breakpoint={breakpoint} aria-hidden={isEmpty}>
      {children}
    </SidebarWrapper>
  );
}
