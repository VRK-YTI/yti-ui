import { getPropertyValue } from '@app/common/components/property-value/get-property-value';
import { Collection } from '@app/common/interfaces/collection.interface';
import { ConceptLink } from '@app/common/interfaces/concept-link.interface';
import { Concept } from '@app/common/interfaces/concept.interface';
import { Property } from '@app/common/interfaces/termed-data-types.interface';

export default function getReferenceValues(
  reference?: Concept[] | ConceptLink[] | Collection[],
  language?: string,
  terminologyId?: string
): {
  id: string;
  href: string;
  value: string;
}[] {
  if (!reference || !language) {
    return [];
  }

  if (isConcept(reference[0])) {
    return (reference as Concept[]).map((r) => {
      const prefLabels: Property[] =
        r.references.prefLabelXl
          ?.flatMap((xl) => xl.properties.prefLabel)
          .filter((label): label is Property => typeof label !== 'undefined') ??
        [];

      const value = getPropertyValue({
        property: prefLabels,
        language: language,
      });

      return {
        id: r.id,
        href: `/terminology/${terminologyId ?? r.type.graph.id}/concept/${
          r.id
        }`,
        value: value,
      };
    });
  }

  if ('targetGraph' in reference[0].properties) {
    return (reference as ConceptLink[]).map((r) => {
      const terminologyId = getPropertyValue({
        property: r.properties.targetGraph,
      });
      const conceptId = getPropertyValue({ property: r.properties.targetId });
      return {
        id: conceptId,
        href: `/terminology/${terminologyId}/concept/${conceptId}`,
        value: getPropertyValue({
          property: r.properties.prefLabel,
          language: language,
        }),
      };
    });
  }

  return (reference as Collection[]).map((r) => ({
    id: r.id,
    href: `/terminology/${terminologyId}/collection/${r.id}`,
    value: getPropertyValue({
      property: r.properties.prefLabel,
      language: language,
    }),
  }));
}

function isConcept(reference: Concept | ConceptLink | Collection): boolean {
  if ('prefLabelXl' in reference.references) {
    return true;
  }

  return false;
}
