import { useTranslation } from 'next-i18next';
import React from 'react';
import { useGetCollectionsQuery } from '@app/common/components/collection/collection.slice';
import Separator from '@app/common/components/separator';
import {
  Sidebar,
  SidebarHeader,
  SidebarSection,
} from '@app/common/components/sidebar';
import { Collection } from '@app/common/interfaces/collection.interface';

export interface CollectionSidebarProps {
  collection: Collection;
}

export default function CollectionSidebar({
  collection,
}: CollectionSidebarProps) {
  const { t } = useTranslation('collection');
  const terminologyId = collection.type.graph.id;
  const { data: collections } = useGetCollectionsQuery(terminologyId);
  const otherCollections = collections?.filter(
    (other) => other.id !== collection.id
  );

  const isEmpty = !otherCollections?.length;

  return (
    <Sidebar isEmpty={isEmpty}>
      {!isEmpty && (
        <>
          <SidebarHeader>{t('sidebar-header')}</SidebarHeader>
          <Separator />
        </>
      )}

      <SidebarSection<Collection>
        heading={t('sidebar-section-heading-other-collections')}
        items={otherCollections}
        href={({ id }) => `/terminology/${terminologyId}/collection/${id}`}
        propertyAccessor={(collection) => collection.properties?.prefLabel}
      />
    </Sidebar>
  );
}
