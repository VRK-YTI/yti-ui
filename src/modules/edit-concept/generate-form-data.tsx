import { Concept } from '@app/common/interfaces/concept.interface';
import { v4 } from 'uuid';
import { EditConceptType } from './new-concept.types';

export default function generateFormData(conceptData: Concept) {
  console.log('generateFormData', conceptData);

  const definition = new Map();
  conceptData.properties.definition?.map(d => {
    definition.set(
      d.lang,
      d.value,
    );
  }) ?? {};

  const retVal: EditConceptType = {
    terms: [],
    basicInformation: {
      definition: Object.fromEntries(definition),
      diagramAndSource: {
        diagram: [],
        sources: conceptData.properties.source?.[0].value ?? ''
      },
      example: conceptData.properties.example?.map(e => ({
        id: v4(),
        lang: e.lang,
        value: e.value
      })) ?? [],
      note: conceptData.properties.note?.map(n => ({
        id: v4(),
        lang: n.lang,
        value: n.value,
      })) ?? [],
      orgInfo: {
        changeHistory: conceptData.properties.changeNote?.[0].value ?? '',
        editorialNote: conceptData.properties.editorialNote?.map(en => ({
          id: v4(),
          lang: '',
          value: en.value,
        })) ?? [],
        etymology: conceptData.properties.historyNote?.[0].value ?? ''
      },
      otherInfo: {
        conceptClass: conceptData.properties.conceptClass?.[0]?.value ?? '',
        wordClass: conceptData.properties.wordClass?.[0]?.value ?? ''
      },
      relationalInfo: {
        broaderConcept: conceptData.references.broader ?? [],
        hasPartConcept: [],
        isPartOfConcept: [],
        matchInOther: [],
        narrowerConcept: [],
        relatedConcept: [],
        relatedConceptInOther: []
      },
      subject: conceptData.properties.subjectArea?.[0].value ?? ''
    }
  };

  const terms = Object.keys(
    conceptData.references
  ).map((key) => {
    return conceptData.references[key as keyof Concept['references']]?.map(label => {
      let termType;
      switch (key) {
        case 'altLabelXl': {
          termType = 'synonym';
          break;
        };
        case 'notRecommendedSynonym': {
          termType = 'not-recommended-synonym';
          break;
        }
        case 'prefLabelXl': {
          termType = 'recommended-term';
          break;
        };
        case 'searchTerm': {
          termType = 'search-term';
          break;
        };
      }

      return {
        changeNote: label.properties.changeNote?.[0].value ?? '',
        draftComment: '',
        editorialNote: label.properties.editorialNote?.map(note => ({
          id: v4(),
          lang: note.lang,
          value: note.value,
        })),
        historyNote: label.properties.historyNote?.[0].value,
        id: v4(),
        language: label.properties.prefLabel?.[0].lang ?? '',
        prefLabel: label.properties.prefLabel?.[0].value ?? '',
        scope: label.properties.scope?.[0].value ?? '',
        source: label.properties.source?.[0].value ?? '',
        status: label.properties.status?.[0].value ?? '',
        termConjugation: label.properties.termConjugation?.[0].value ?? '',
        termEquivalency: label.properties.termEquivalency?.[0].value ?? '',
        termEquivalencyRelation: label.properties.termEquivalencyRelation?.[0].value ?? '',
        termFamily: label.properties.termFamily?.[0].value ?? '',
        termHomographNumber: label.properties.termHomographNumber?.[0].value ?? '',
        termInfo: label.properties.termInfo?.[0].value ?? '',
        termStyle: label.properties.termStyle?.[0].value ?? '',
        termType: termType,
        wordClass: label.properties.wordClass?.[0].value ?? '',
      };
    });
  }) ?? [];

  return {
    ...retVal,
    terms: terms.flat(),
  };
}
