import { useTranslation } from 'next-i18next';
import React from 'react';
import Separator from 'yti-common-ui/separator';
import { Sidebar, SidebarHeader, SidebarSection } from 'yti-common-ui/sidebar';
import { Concept } from '@app/common/interfaces/concept.interface';
import getReferenceValues from './get-reference-values';

export interface ConceptSidebarProps {
  concept?: Concept;
}

export default function ConceptSidebar({ concept }: ConceptSidebarProps) {
  const { t, i18n } = useTranslation('concept');

  const terminologyId = concept?.type.graph.id;

  const shouldRenderDivider1 =
    [
      concept?.references.broader,
      concept?.references.narrower,
      concept?.references.related,
      concept?.references.isPartOf,
      concept?.references.hasPart,
      concept?.references.relatedMatch,
      concept?.references.exactMatch,
      concept?.references.closeMatch,
    ]
      .flat()
      .filter(Boolean).length > 0;

  const shouldRenderDivider2 = false;

  const shouldRenderDivider3 =
    [concept?.referrers.member].flat().filter(Boolean).length > 0;

  const isEmpty =
    !shouldRenderDivider1 && !shouldRenderDivider2 && !shouldRenderDivider3;

  return (
    <Sidebar isEmpty={isEmpty}>
      {!isEmpty && <SidebarHeader>{t('sidebar-header')}</SidebarHeader>}

      {shouldRenderDivider1 && <Separator />}

      <SidebarSection
        heading={t('sidebar-section-heading-broader')}
        items={getReferenceValues(
          concept?.references.broader,
          i18n.language,
          terminologyId
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-narrower')}
        items={getReferenceValues(
          concept?.references.narrower,
          i18n.language,
          terminologyId
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-related')}
        items={getReferenceValues(
          concept?.references.related,
          i18n.language,
          terminologyId
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-is-part-of')}
        items={getReferenceValues(
          concept?.references.isPartOf,
          i18n.language,
          terminologyId
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-has-part')}
        items={getReferenceValues(
          concept?.references.hasPart,
          i18n.language,
          terminologyId
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-related-match')}
        items={getReferenceValues(
          concept?.references.relatedMatch,
          i18n.language
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-exact-match')}
        items={getReferenceValues(
          concept?.references.exactMatch,
          i18n.language
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-close-match')}
        items={getReferenceValues(
          concept?.references.closeMatch,
          i18n.language
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-broad-match')}
        items={getReferenceValues(
          concept?.references.broadMatch,
          i18n.language
        )}
      />

      <SidebarSection
        heading={t('sidebar-section-heading-narrow-match')}
        items={getReferenceValues(
          concept?.references.narrowMatch,
          i18n.language
        )}
      />
      {shouldRenderDivider2 && <Separator />}

      {/* <SidebarSection<ConceptLink>
        header={t('sidebar-section-heading-in-other-terminologies')}
        items={concept?.references.closeMatch}
        linkPrefix={`/terminology/${terminologyId}/concept/`}
        propertyAccessor={conceptLink => conceptLink?.properties?.prefLabel}
      /> */}

      {shouldRenderDivider3 && <Separator />}

      <SidebarSection
        heading={t('sidebar-section-heading-member')}
        items={getReferenceValues(
          concept?.referrers.member,
          i18n.language,
          terminologyId
        )}
      />
    </Sidebar>
  );
}
