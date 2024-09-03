import { i18n, useTranslation } from 'next-i18next';
import React from 'react';
import Separator from 'yti-common-ui/separator';
import { Sidebar, SidebarHeader, SidebarSection } from 'yti-common-ui/sidebar';
import {
  ConceptInfo,
  ConceptReferenceInfo,
} from '@app/common/interfaces/interfaces-v2';
import { getLanguageVersion } from 'yti-common-ui/utils/get-language-version';

export interface ConceptSidebarProps {
  concept?: ConceptInfo;
}

function getConceptReferenceValues(references?: ConceptReferenceInfo[]) {
  return getReferenceValues('concept', references);
}

function getCollectiontReferenceValues(references?: ConceptReferenceInfo[]) {
  return getReferenceValues('collection', references);
}

function getReferenceValues(
  type: 'concept' | 'collection',
  references?: ConceptReferenceInfo[]
) {
  if (!references) {
    return [];
  }

  return references.map((ref) => {
    return {
      id: ref.referenceURI,
      href: `/terminology/${ref.prefix}/${type}/${ref.identifier}`,
      value: getLanguageVersion({
        data: ref.label,
        lang: i18n?.language ?? 'fi',
      }),
    };
  });
}

export default function ConceptSidebar({ concept }: ConceptSidebarProps) {
  const { t, i18n } = useTranslation('concept');

  const shouldRenderDivider1 =
    [
      concept?.broader,
      concept?.narrower,
      concept?.related,
      concept?.isPartOf,
      concept?.hasPart,
      concept?.relatedMatch,
      concept?.exactMatch,
      concept?.closeMatch,
    ]
      .flat()
      .filter(Boolean).length > 0;

  const shouldRenderDivider2 = (concept?.memberOf ?? []).length > 0;

  const isEmpty = !shouldRenderDivider1 && !shouldRenderDivider2;

  return (
    <Sidebar isEmpty={isEmpty}>
      {!isEmpty && <SidebarHeader>{t('sidebar-header')}</SidebarHeader>}

      {shouldRenderDivider1 && <Separator />}

      <SidebarSection
        heading={t('sidebar-section-heading-broader')}
        items={getConceptReferenceValues(concept?.broader)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-narrower')}
        items={getConceptReferenceValues(concept?.narrower)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-related')}
        items={getConceptReferenceValues(concept?.related)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-is-part-of')}
        items={getConceptReferenceValues(concept?.isPartOf)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-has-part')}
        items={getConceptReferenceValues(concept?.hasPart)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-related-match')}
        items={getConceptReferenceValues(concept?.relatedMatch)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-exact-match')}
        items={getConceptReferenceValues(concept?.exactMatch)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-close-match')}
        items={getConceptReferenceValues(concept?.closeMatch)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-broad-match')}
        items={getConceptReferenceValues(concept?.broadMatch)}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-narrow-match')}
        items={getConceptReferenceValues(concept?.narrowMatch)}
      />

      {shouldRenderDivider2 && <Separator />}

      <SidebarSection
        heading={t('sidebar-section-heading-member')}
        items={getCollectiontReferenceValues(concept?.memberOf)}
      />
    </Sidebar>
  );
}
