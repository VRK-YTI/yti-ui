import { useTranslation } from 'next-i18next';
import React from 'react';
import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import Separator from '@common/components/separator';
import {
  Sidebar,
  SidebarHeader,
  SidebarSection,
} from '@app/common/components/sidebar';
import { Collection } from '@app/common/interfaces/collection.interface';
import { ConceptLink } from '@app/common/interfaces/concept-link.interface';
import { Concept } from '@app/common/interfaces/concept.interface';

export interface ConceptSidebarProps {
  concept?: Concept;
}

export default function ConceptSidebar({ concept }: ConceptSidebarProps) {
  const { t } = useTranslation('concept');

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

      <SidebarSection<Concept>
        heading={t('sidebar-section-heading-broader')}
        items={concept?.references.broader}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl}
      />

      <SidebarSection<Concept>
        heading={t('sidebar-section-heading-narrower')}
        items={concept?.references.narrower}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl}
      />

      <SidebarSection<Concept>
        heading={t('sidebar-section-heading-related')}
        items={concept?.references.related}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl}
      />

      <SidebarSection<Concept>
        heading={t('sidebar-section-heading-is-part-of')}
        items={concept?.references.isPartOf}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl}
      />

      <SidebarSection<Concept>
        heading={t('sidebar-section-heading-has-part')}
        items={concept?.references.hasPart}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl}
      />

      <SidebarSection<ConceptLink>
        heading={t('sidebar-section-heading-related-match')}
        items={concept?.references.relatedMatch}
        href={({ properties }) => {
          const terminologyId = getPropertyValue({
            property: properties.targetGraph,
          });
          const conceptId = getPropertyValue({ property: properties.targetId });
          return `/terminology/${terminologyId}/concept/${conceptId}`;
        }}
        propertyAccessor={({ properties }) => properties?.prefLabel}
      />

      <SidebarSection<ConceptLink>
        heading={t('sidebar-section-heading-exact-match')}
        items={concept?.references.exactMatch}
        href={({ properties }) => {
          const terminologyId = getPropertyValue({
            property: properties.targetGraph,
          });
          const conceptId = getPropertyValue({ property: properties.targetId });
          return `/terminology/${terminologyId}/concept/${conceptId}`;
        }}
        propertyAccessor={({ properties }) => properties?.prefLabel}
      />

      <SidebarSection<ConceptLink>
        heading={t('sidebar-section-heading-close-match')}
        items={concept?.references.closeMatch}
        href={({ properties }) => {
          const terminologyId = getPropertyValue({
            property: properties.targetGraph,
          });
          const conceptId = getPropertyValue({ property: properties.targetId });
          return `/terminology/${terminologyId}/concept/${conceptId}`;
        }}
        propertyAccessor={({ properties }) => properties?.prefLabel}
      />

      {shouldRenderDivider2 && <Separator />}

      {/* <SidebarSection<ConceptLink>
        header={t('sidebar-section-heading-in-other-terminologies')}
        items={concept?.references.closeMatch}
        linkPrefix={`/terminology/${terminologyId}/concept/`}
        propertyAccessor={conceptLink => conceptLink?.properties?.prefLabel}
      /> */}

      {shouldRenderDivider3 && <Separator />}

      <SidebarSection<Collection>
        heading={t('sidebar-section-heading-member')}
        items={concept?.referrers.member}
        href={({ id }) => `/terminology/${terminologyId}/collection/${id}`}
        propertyAccessor={({ properties }) => properties?.prefLabel}
      />
    </Sidebar>
  );
}
