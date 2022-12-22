import { useTranslation } from 'next-i18next';
import React from 'react';
import { useGetCollectionsQuery } from '@app/common/components/collection/collection.slice';
import Separator from 'yti-common-ui/separator';
import { Sidebar, SidebarHeader, SidebarSection } from 'yti-common-ui/sidebar';
import { Collection } from '@app/common/interfaces/collection.interface';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';

export interface CollectionSidebarProps {
  collection: Collection;
}

export default function CollectionSidebar({
  collection,
}: CollectionSidebarProps) {
  const { t, i18n } = useTranslation('collection');
  const terminologyId = collection.type.graph.id;
  const { data: collections } = useGetCollectionsQuery(terminologyId);
  const otherCollections = collections
    ?.filter((other) => other.id !== collection.id)
    .map((c) => ({
      id: c.id,
      href: `/terminology/${terminologyId}/collection/${c.id}`,
      value: getPropertyValue({
        property: c.properties.prefLabel,
        language: i18n.language,
      }),
    }));

  const isEmpty = !otherCollections?.length;

  return (
    <Sidebar isEmpty={isEmpty}>
      {!isEmpty && (
        <>
          <SidebarHeader>{t('sidebar-header')}</SidebarHeader>
          <Separator />
        </>
      )}

      <SidebarSection
        heading={t('sidebar-section-heading-other-collections')}
        items={otherCollections}
      />
    </Sidebar>
  );
}
