import { v4 } from 'uuid';
import { ConceptTermType, EditConceptType } from './new-concept.types';
import {
  ConceptInfo,
  ConceptReferenceInfo,
  LocalizedListItem,
  LocalizedValue,
  Term,
} from '@app/common/interfaces/interfaces-v2';

export default function generateFormData(
  preferredTerms: LocalizedValue,
  conceptData?: ConceptInfo
): EditConceptType {
  if (!conceptData) {
    return {
      terms: Object.keys(preferredTerms).map((lang) => ({
        changeNote: '',
        editorialNote: [],
        historyNote: '',
        id: v4(),
        language: lang,
        prefLabel: preferredTerms[lang],
        scope: '',
        source: [],
        status: 'DRAFT',
        termConjugation: '',
        termEquivalency: '',
        termEquivalencyRelation: '',
        termFamily: '',
        termHomographNumber: '',
        termInfo: '',
        termStyle: '',
        termType: 'recommended-term',
        wordClass: '',
      })),
      basicInformation: {
        identifier: '',
        definition: {},
        example: [],
        status: 'DRAFT',
        subject: '',
        note: [],
        diagramAndSource: {
          diagrams: [],
          sources: [],
        },
        orgInfo: {
          changeHistory: '',
          editorialNote: [],
          etymology: '',
        },
        otherInfo: {
          conceptClass: '',
        },
        relationalInfo: {
          broaderConcept: [],
          narrowerConcept: [],
          relatedConcept: [],
          isPartOfConcept: [],
          hasPartConcept: [],
          relatedConceptInOther: [],
          matchInOther: [],
          closeMatch: [],
          broadInOther: [],
          narrowInOther: [],
        },
      },
    };
  }

  const retVal: EditConceptType = {
    basicInformation: {
      identifier: conceptData.identifier,
      definition: conceptData.definition,
      example: conceptData.examples.map(mapListType),
      status: conceptData.status,
      subject: conceptData.subjectArea,
      note: conceptData.notes.map(mapListType),
      diagramAndSource: {
        diagrams: conceptData.links.map((link) => ({
          id: v4(),
          name: link.name,
          description: link.description,
          url: link.uri,
        })),
        sources: conceptData.sources.map(mapListType),
      },
      orgInfo: {
        changeHistory: conceptData.changeNote,
        editorialNote: conceptData.editorialNotes.map(mapListType),
        etymology: conceptData.historyNote,
      },
      otherInfo: {
        conceptClass: conceptData.conceptClass,
      },
      relationalInfo: {
        broaderConcept: conceptData.broader.map(mapRelationInfo),
        narrowerConcept: conceptData.narrower.map(mapRelationInfo),
        relatedConcept: conceptData.related.map(mapRelationInfo),
        isPartOfConcept: conceptData.isPartOf.map(mapRelationInfo),
        hasPartConcept: conceptData.hasPart.map(mapRelationInfo),
        relatedConceptInOther: conceptData.relatedMatch.map(mapRelationInfo),
        matchInOther: conceptData.exactMatch.map(mapRelationInfo),
        closeMatch: conceptData.closeMatch.map(mapRelationInfo),
        broadInOther: conceptData.broadMatch.map(mapRelationInfo),
        narrowInOther: conceptData.narrowMatch.map(mapRelationInfo),
      },
    },
    terms: [
      ...conceptData.recommendedTerms.map((t) =>
        mapTerm(t, 'recommended-term')
      ),
      ...conceptData.synonyms.map((t) => mapTerm(t, 'synonym')),
      ...conceptData.notRecommendedTerms.map((t) =>
        mapTerm(t, 'not-recommended-synonym')
      ),
      ...conceptData.searchTerms.map((t) => mapTerm(t, 'search-term')),
    ],
  };

  return retVal;
}

const mapListType = (e: LocalizedListItem | string) => ({
  id: v4(),
  lang: typeof e === 'string' ? '' : e.language,
  value: typeof e === 'string' ? e : e.value,
});

const mapTerm = (term: Term, type: string) => {
  return {
    changeNote: term.changeNote,
    editorialNote: term.editorialNotes?.map(mapListType),
    historyNote: term.historyNote,
    id: v4(),
    language: term.language,
    prefLabel: term.label,
    scope: term.scope,
    source: term.sources?.map(mapListType),
    status: term.status,
    termConjugation: term.termConjugation,
    termEquivalency: term.termEquivalency,
    termFamily: term.termFamily,
    termHomographNumber: term.homographNumber
      ? term.homographNumber + ''
      : null,
    termInfo: term.termInfo,
    termStyle: term.termStyle,
    termType: type,
    wordClass: term.wordClass,
  } as ConceptTermType;
};

const mapRelationInfo = (r: ConceptReferenceInfo) => {
  return {
    id: r.referenceURI,
    label: r.label,
    terminologyId: r.prefix,
    terminologyLabel: r.terminologyLabel,
  };
};
