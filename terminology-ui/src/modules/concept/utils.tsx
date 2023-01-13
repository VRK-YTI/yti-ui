import { Concept } from '@app/common/interfaces/concept.interface';
import { Property } from '@app/common/interfaces/termed-data-types.interface';
import {
  compareLocales,
  TermBlockType,
} from '@app/common/utils/compare-locals';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

export function useGetBlockData(concept?: Concept) {
  const { t } = useTranslation('concept');
  const [terms, setTerms] = useState<TermBlockType[] | undefined>();
  const [definitions, setDefinitions] = useState<Property[] | undefined>();
  const [notes, setNotes] = useState<Property[] | undefined>();
  const [examples, setExamples] = useState<Property[] | undefined>();

  useEffect(() => {
    if (!concept) {
      setTerms(undefined);
      setDefinitions(undefined);
      setNotes(undefined);
      setExamples(undefined);
      return;
    }

    if (!terms) {
      setTerms(
        [
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
        ].sort((t1, t2) => compareLocales(t1, t2))
      );
    }

    if (!definitions && concept.properties.definition) {
      const sortedDefinitions = concept.properties.definition
        .slice()
        .sort((t1, t2) => compareLocales(t1, t2));

      setDefinitions(sortedDefinitions);
    }

    if (!notes && concept.properties.note) {
      const sortedDefinitions = concept.properties.note
        .slice()
        .sort((t1, t2) => compareLocales(t1, t2));

      setNotes(sortedDefinitions);
    }

    if (!examples && concept.properties.example) {
      const sortedDefinitions = concept.properties.example
        .slice()
        .sort((t1, t2) => compareLocales(t1, t2));

      setExamples(sortedDefinitions);
    }
  }, [concept, terms, definitions, notes, examples, t]);

  return { terms, definitions, notes, examples };
}
