import React from 'react';
import Link from 'next/link';
import { Link as SuomiLink } from 'suomifi-ui-components';
import { SidebarLinkList, SidebarLinkListItem, SidebarSubHeader } from '.';
import {
  BaseEntity,
  Property,
} from '@app/common/interfaces/termed-data-types.interface';
import PropertyValue from '@app/common/components/property-value';
import { Term } from '@app/common/interfaces/term.interface';
import { isEmpty } from 'lodash';
import { useGeneratedId } from '@app/common/utils/hooks/useGeneratedId';

interface SidebarSectionProps<T> {
  heading: React.ReactNode;
  items?: T[];
  href: (item: T) => string;
  propertyAccessor: (item: T) => Property[] | Term[] | undefined;
}

export default function SidebarSection<T extends BaseEntity<string>>({
  heading,
  items,
  href,
  propertyAccessor,
}: SidebarSectionProps<T>) {
  const id = useGeneratedId();

  if (!items?.length) {
    return null;
  }

  return (
    <>
      <SidebarSubHeader id={`${id}-header`}>{heading}</SidebarSubHeader>
      <SidebarLinkList aria-labelledby={`${id}-header`}>
        {items.map((item) => (
          <SidebarLinkListItem key={item.id}>
            <Link href={href(item)} passHref>
              <SuomiLink href="">{propertyValue(item)}</SuomiLink>
            </Link>
          </SidebarLinkListItem>
        ))}
      </SidebarLinkList>
    </>
  );

  function propertyValue(currItem: T) {
    if (!isEmpty(currItem.references)) {
      if ('member' in currItem.references) {
        const prefLabels = Array.from(propertyAccessor(currItem) as Property[]);

        return (
          <PropertyValue
            property={prefLabels as Property[]}
            fallbackLanguage="fi"
          />
        );
      } else {
        const prefLabels = Array.from(
          propertyAccessor(currItem) as Term[],
          (x) => {
            if (x.properties?.prefLabel && x.properties.prefLabel[0]) {
              return x.properties.prefLabel[0];
            }
          }
        );

        return (
          <PropertyValue
            property={prefLabels as Property[]}
            fallbackLanguage="fi"
          />
        );
      }
    } else {
      return (
        <PropertyValue
          property={propertyAccessor(currItem) as Property[]}
          fallbackLanguage="fi"
        />
      );
    }
  }
}
