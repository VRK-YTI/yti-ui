import React from 'react';
import Link from 'next/link';
import { Link as SuomiLink } from 'suomifi-ui-components';
import { SidebarLinkList, SidebarLinkListItem, SidebarSubHeader } from '.';
import { BaseEntity, Property } from '../../interfaces/termed-data-types.interface';
import PropertyValue from '../property-value';
import { getPropertyValue } from '../property-value/get-property-value';

interface SidebarSectionProps<T> {
  heading: React.ReactNode;
  items?: T[];
  href: (item: T) => string;
  propertyAccessor: (item: T) => Property[] | undefined;
}

export default function SidebarSection<T extends BaseEntity<string>>({
  heading,
  items,
  href,
  propertyAccessor
}: SidebarSectionProps<T>) {
  if (!items?.length) {
    return null;
  }

  const test = {property: Array.from(propertyAccessor(items[0]), x => x.properties?.prefLabel[0])};
  console.log(test);

  if (test.property[0]) {
    getPropertyValue({property: test, language: 'en'});
  }

  return (
    <>
      <SidebarSubHeader>{heading}</SidebarSubHeader>
      <SidebarLinkList>
        {items.map(item => (
          <SidebarLinkListItem key={item.id}>
            <Link href={href(item)} passHref>
              <SuomiLink href=''>
                <PropertyValue
                  property={propertyAccessor(item)}
                  fallbackLanguage="fi"
                />
              </SuomiLink>
            </Link>
          </SidebarLinkListItem>
        ))}
      </SidebarLinkList>
    </>
  );
}
