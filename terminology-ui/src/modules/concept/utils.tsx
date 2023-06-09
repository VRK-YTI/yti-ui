import { Concept } from '@app/common/interfaces/concept.interface';
import { Term } from '@app/common/interfaces/term.interface';
import { compareLocales } from '@app/common/utils/compare-locals';
import { TFunction } from 'next-i18next';

const langOrder: { [key: string]: string } = {
  fi: 'a',
  sv: 'b',
  en: 'c',
};

const termTypeOrder: { [key: string]: string } = {
  prefLabelXl: 'a',
  altLabelXl: 'b',
};

/**
 * Create compare key to simplify ordering terms.
 * Terms order withing language: recommended term, synonyms, other terms
 * Final order:
 * - finnish terms
 * - swedish terms
 * - english terms
 * - terms in other languages ordered by language name
 *
 * @param term term object
 * @param type term's type
 * @returns
 */
function getCompareKey(term: Term, type: string) {
  const prefLabel = term.properties.prefLabel?.[0];
  const langKey = `${
    langOrder[prefLabel?.lang ?? ''] ?? `x_${prefLabel?.lang}`
  }`;
  return `${langKey}_${termTypeOrder[type] ?? 'x'}_${prefLabel?.value}`;
}

export function getBlockData(t: TFunction, concept?: Concept) {
  if (!concept) {
    return { terms: [], definitions: [], notes: [], examples: [] };
  }

  const terms = [
    ...(concept.references.prefLabelXl ?? []).map((term) => ({
      term,
      type: t('field-terms-preferred', { ns: 'concept' }),
      compareKey: getCompareKey(term, 'prefLabelXl'),
    })),
    ...(concept.references.altLabelXl ?? []).map((term) => ({
      term,
      type: t('field-terms-alternative', { ns: 'concept' }),
      compareKey: getCompareKey(term, 'altLabelXl'),
    })),
    ...(concept.references.notRecommendedSynonym ?? []).map((term) => ({
      term,
      type: t('field-terms-non-recommended', { ns: 'concept' }),
      compareKey: getCompareKey(term, 'notRecommendedSynonym'),
    })),
    ...(concept.references.hiddenTerm ?? []).map((term) => ({
      term,
      type: t('field-terms-hidden', { ns: 'concept' }),
      compareKey: getCompareKey(term, 'hiddenTerm'),
    })),
  ].sort((t1, t2) => t1.compareKey.localeCompare(t2.compareKey));

  const definitions =
    concept.properties.definition
      ?.slice()
      .sort((t1, t2) => compareLocales(t1, t2)) ?? [];

  const notes =
    concept.properties.note?.slice().sort((t1, t2) => compareLocales(t1, t2)) ??
    [];

  const examples =
    concept.properties.example
      ?.slice()
      .sort((t1, t2) => compareLocales(t1, t2)) ?? [];

  return { terms, definitions, notes, examples };
}
