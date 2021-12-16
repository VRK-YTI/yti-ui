import React from 'react';
import { Link } from 'suomifi-ui-components';
import { SidebarLinkList, SidebarLinkListItem, SidebarSubHeader } from '.';
import { BaseEntity, Property } from '../../interfaces/termed-data-types.interface';
import PropertyValue from '../property-value';

interface SidebarSectionProps<T> {
  header: React.ReactNode;
  items?: T[];
  href: (item: T) => string;
  propertyAccessor: (item: T) => Property[] | undefined;
}

export default function SidebarSection<T extends BaseEntity<string>>({
  header,
  items,
  href,
  propertyAccessor
}: SidebarSectionProps<T>) {
  if (!items?.length) {
    return null;
  }

  return (
    <>
      <SidebarSubHeader>{header}</SidebarSubHeader>
      <SidebarLinkList>
        {items.map(item => (
          <SidebarLinkListItem key={item.id}>
            <Link href={href(item)}>
              <PropertyValue property={propertyAccessor(item)} />
            </Link>
          </SidebarLinkListItem>
        ))}
      </SidebarLinkList>
    </>
  );
}
