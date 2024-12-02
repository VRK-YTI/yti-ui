import { useTranslation } from 'next-i18next';
import React from 'react';
import { useGetCollectionsQuery } from '@app/common/components/collection/collection.slice';
import Separator from 'yti-common-ui/separator';
import { Sidebar, SidebarHeader, SidebarSection } from 'yti-common-ui/sidebar';
import { ConceptCollectionInfo } from '@app/common/interfaces/interfaces-v2';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

export interface CollectionSidebarProps {
  collection: ConceptCollectionInfo;
  prefix: string;
}

export default function CollectionSidebar({
  collection,
  prefix,
}: CollectionSidebarProps) {
  const { t, i18n } = useTranslation('collection');
  const { data: collections } = useGetCollectionsQuery(prefix);
  const otherCollections = collections
    ?.filter((other) => other.identifier !== collection.identifier)
    .map((c) => ({
      id: c.identifier,
      href: `/terminology/${prefix}/collection/${c.identifier}`,
      value: getLanguageVersion({
        data: c.label,
        lang: i18n.language,
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
