import React from 'react';
import Link from 'next/link';
import { Link as SuomiLink } from 'suomifi-ui-components';
import { SidebarLinkList, SidebarLinkListItem, SidebarSubHeader } from '.';
import { v4 } from 'uuid';

interface SidebarSectionProps {
  heading: React.ReactNode;
  items?: {
    id: string;
    href: string;
    value: string;
  }[];
}

export default function SidebarSection({
  heading,
  items,
}: SidebarSectionProps) {
  const id = v4();

  if (!items || !items.length) {
    return null;
  }

  return (
    <div className="sidebar-section">
      <SidebarSubHeader id={`${id}-header`}>{heading}</SidebarSubHeader>
      <SidebarLinkList aria-labelledby={`${id}-header`}>
        {items.map((item) => (
          <SidebarLinkListItem key={item.id}>
            <Link href={item.href} passHref>
              <SuomiLink href="">{item.value}</SuomiLink>
            </Link>
          </SidebarLinkListItem>
        ))}
      </SidebarLinkList>
    </div>
  );
}
