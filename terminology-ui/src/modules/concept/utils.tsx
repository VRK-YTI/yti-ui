import {
  ConceptInfo,
  LocalizedValue,
  Term,
} from '@app/common/interfaces/interfaces-v2';
import { sortPropertyListByLanguage } from '@app/common/utils/compare-locals';
import { TFunction } from 'next-i18next';
import { compareLocales } from 'yti-common-ui/utils/compare-locales';

const langOrder: { [key: string]: string } = {
  fi: 'a',
  sv: 'b',
  en: 'c',
};

const termTypeOrder: { [key: string]: string } = {
  recommendedTerm: 'a',
  synonym: 'b',
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
function getCompareKey(term: Term, type: string, index: number) {
  const langKey = `${langOrder[term.language ?? ''] ?? `x_${term.language}`}`;
  return `${langKey}_${termTypeOrder[type] ?? 'x'}_${index}`;
}

export function getBlockData(t: TFunction, concept?: ConceptInfo) {
  if (!concept) {
    return { terms: [], definitions: {}, notes: [], examples: [] };
  }

  const terms = [
    ...(concept.recommendedTerms ?? []).map((term, idx) => ({
      term,
      type: t('field-terms-preferred', { ns: 'concept' }),
      compareKey: getCompareKey(term, 'recommendedTerm', idx),
    })),
    ...(concept.synonyms ?? []).map((term, idx) => ({
      term,
      type: t('field-terms-alternative', { ns: 'concept' }),
      compareKey: getCompareKey(term, 'synonym', idx),
    })),
    ...(concept.notRecommendedTerms ?? []).map((term, idx) => ({
      term,
      type: t('field-terms-non-recommended', { ns: 'concept' }),
      compareKey: getCompareKey(term, 'notRecommendedSynonym', idx),
    })),
    ...(concept.searchTerms ?? []).map((term) => ({
      term,
      type: t('field-terms-hidden', { ns: 'concept' }),
      compareKey: getCompareKey(term, 'searchTerm', 0),
    })),
  ].sort((t1, t2) => t1.compareKey.localeCompare(t2.compareKey));

  const definitions =
    Object.keys(concept.definition)
      ?.slice()
      .sort((t1, t2) => compareLocales(t1, t2))
      .reduce((result, lang) => {
        result[lang] = concept.definition[lang];
        return result;
      }, {} as LocalizedValue) ?? {};

  const notes = sortPropertyListByLanguage(concept.notes);
  const examples = sortPropertyListByLanguage(concept.examples);

  return { terms, definitions, notes, examples };
}
