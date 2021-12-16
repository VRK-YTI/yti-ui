import React from 'react';
import { getPropertyValue } from '../../common/components/property-value';
import {
  Sidebar,
  SidebarDivider,
  SidebarHeader,
  SidebarSection,
} from '../../common/components/sidebar';
import { Collection } from '../../common/interfaces/collection.interface';
import { ConceptLink } from '../../common/interfaces/concept-link.interface';
import { Concept } from '../../common/interfaces/concept.interface';

export interface ConceptSidebarProps {
  concept?: Concept;
}

export default function ConceptSidebar({ concept }: ConceptSidebarProps) {
  const terminologyId = concept?.type.graph.id;

  const shouldRenderDivider1 = [
    concept?.references.broader,
    concept?.references.narrower,
    concept?.references.related,
    concept?.references.isPartOf,
    concept?.references.hasPart,
    concept?.references.relatedMatch,
    concept?.references.exactMatch,
    concept?.references.closeMatch,
  ].flat().filter(Boolean).length > 0;

  const shouldRenderDivider2 = false;

  const shouldRenderDivider3 = [
    concept?.referrers.member
  ].flat().filter(Boolean).length > 0;

  const shouldRenderEmptyState = !shouldRenderDivider1 && !shouldRenderDivider2 && !shouldRenderDivider3;

  return (
    <Sidebar>
      <SidebarHeader>Suhdetiedot</SidebarHeader>

      {shouldRenderDivider1 && <SidebarDivider />}

      <SidebarSection<Concept>
        header="Hierarkkinen yläkäsite"
        items={concept?.references.broader}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl?.[0]?.properties?.prefLabel}
      />

      <SidebarSection<Concept>
        header="Hierarkkinen alakäsite"
        items={concept?.references.narrower}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl?.[0]?.properties?.prefLabel}
      />

      <SidebarSection<Concept>
        header="Liittyvä käsite"
        items={concept?.references.related}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl?.[0]?.properties?.prefLabel}
      />

      <SidebarSection<Concept>
        header="Koostumussuhteinen yläkäsite"
        items={concept?.references.isPartOf}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl?.[0]?.properties?.prefLabel}
      />

      <SidebarSection<Concept>
        header="Koostumussuhteinen alakäsite"
        items={concept?.references.hasPart}
        href={({ id }) => `/terminology/${terminologyId}/concept/${id}`}
        propertyAccessor={({ references }) => references?.prefLabelXl?.[0]?.properties?.prefLabel}
      />

      <SidebarSection<ConceptLink>
        header="Liittyvä käsite toisessa sanastossa"
        items={concept?.references.relatedMatch}
        href={({ properties }) => {
          const terminologyId = getPropertyValue(properties.targetGraph);
          const conceptId = getPropertyValue(properties.targetId);
          return `/terminology/${terminologyId}/concept/${conceptId}`;
        }}
        propertyAccessor={({ properties }) => properties?.prefLabel}
      />

      <SidebarSection<ConceptLink>
        header="Vastaava käsite toisessa sanastossa"
        items={concept?.references.exactMatch}
        href={({ properties }) => {
          const terminologyId = getPropertyValue(properties.targetGraph);
          const conceptId = getPropertyValue(properties.targetId);
          return `/terminology/${terminologyId}/concept/${conceptId}`;
        }}
        propertyAccessor={({ properties }) => properties?.prefLabel}
      />

      <SidebarSection<ConceptLink>
        header="Lähes vastaava käsite toisessa sanastossa"
        items={concept?.references.closeMatch}
        href={({ properties }) => {
          const terminologyId = getPropertyValue(properties.targetGraph);
          const conceptId = getPropertyValue(properties.targetId);
          return `/terminology/${terminologyId}/concept/${conceptId}`;
        }}
        propertyAccessor={({ properties }) => properties?.prefLabel}
      />

      {shouldRenderDivider2 && <SidebarDivider />}

      {/* <SidebarSection<ConceptLink>
        header="Käsite muissa sanastoissa"
        items={concept?.references.closeMatch}
        linkPrefix={`/terminology/${terminologyId}/concept/`}
        propertyAccessor={conceptLink => conceptLink?.properties?.prefLabel}
      /> */}

      {shouldRenderDivider3 && <SidebarDivider />}

      <SidebarSection<Collection>
        header="Kuuluu käsitekokoelmaan"
        items={concept?.referrers.member}
        href={({ id }) => `/terminology/${terminologyId}/collection/${id}`}
        propertyAccessor={({ properties }) => properties?.prefLabel}
      />

      {shouldRenderEmptyState && (
        <>
          <SidebarDivider />

          TODO: Empty state
        </>
      )}
    </Sidebar>
  );
};
