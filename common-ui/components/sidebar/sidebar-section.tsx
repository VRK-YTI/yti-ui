import React from 'react';
import Link from 'next/link';
import { Link as SuomiLink } from 'suomifi-ui-components';
import { SidebarLinkList, SidebarLinkListItem, SidebarSubHeader } from '.';

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
  if (!items || !items.length) {
    return null;
  }

  return (
    <div className="sidebar-section">
      <SidebarSubHeader id={`${items[0].id}-header`}>
        {heading}
      </SidebarSubHeader>
      <SidebarLinkList aria-labelledby={`${items[0].id}-header`}>
        {items.map((item) => (
          <SidebarLinkListItem key={item.id}>
            <Link href={item.href} passHref legacyBehavior>
              <SuomiLink href="">{item.value}</SuomiLink>
            </Link>
          </SidebarLinkListItem>
        ))}
      </SidebarLinkList>
    </div>
  );
}
