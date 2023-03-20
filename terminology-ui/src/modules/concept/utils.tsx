import { Concept } from '@app/common/interfaces/concept.interface';
import { compareLocales } from '@app/common/utils/compare-locals';
import { TFunction } from 'next-i18next';

export function getBlockData(t: TFunction, concept?: Concept) {
  if (!concept) {
    return { terms: [], definitions: [], notes: [], examples: [] };
  }

  const terms = [
    ...(concept.references.prefLabelXl ?? []).map((term) => ({
      term,
      type: t('field-terms-preferred'),
    })),
    ...(concept.references.altLabelXl ?? []).map((term) => ({
      term,
      type: t('field-terms-alternative'),
    })),
    ...(concept.references.notRecommendedSynonym ?? []).map((term) => ({
      term,
      type: t('field-terms-non-recommended'),
    })),
    ...(concept.references.hiddenTerm ?? []).map((term) => ({
      term,
      type: t('field-terms-hidden'),
    })),
  ].sort((t1, t2) => compareLocales(t1, t2));

  const definitions =
    concept.properties.definition
      ?.slice()
      .sort((t1, t2) => compareLocales(t1, t2)) ?? [];

  const notes =
    concept.properties.note?.slice().sort((t1, t2) => compareLocales(t1, t2)) ??
    [];

  const examples = concept.properties.example
    ?.slice()
    .sort((t1, t2) => compareLocales(t1, t2));

  return { terms, definitions, notes, examples };
}
