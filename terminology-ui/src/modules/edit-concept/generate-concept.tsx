import { ConceptTermType, EditConceptType } from './new-concept.types';
import {
  Concept,
  LocalizedValue,
  Term,
} from '@app/common/interfaces/interfaces-v2';

interface generateConceptProps {
  data: EditConceptType;
  isEdit: boolean;
}

export default function generateConceptPayload({
  data,
  isEdit,
}: generateConceptProps) {
  const basicInfo = data.basicInformation;
  const relations = basicInfo.relationalInfo;

  const definition = Object.keys(basicInfo.definition).reduce(
    (definition, lang) => {
      if (basicInfo.definition[lang]) {
        definition[lang] = basicInfo.definition[lang];
      }
      return definition;
    },
    {} as LocalizedValue
  );

  return {
    ...(!isEdit && { identifier: basicInfo.identifier }),
    definition,
    notes: basicInfo.note.map((note) => ({
      language: note.lang,
      value: note.value,
    })),
    examples: basicInfo.example.map((ex) => ({
      language: ex.lang,
      value: ex.value,
    })),
    subjectArea: basicInfo.subject,
    status: basicInfo.status,
    sources: basicInfo.diagramAndSource.sources.map((source) => source.value),
    links: basicInfo.diagramAndSource.diagrams.map((link) => ({
      name: link.name,
      uri: link.url,
      description: link.description,
    })),
    changeNote: basicInfo.orgInfo.changeHistory,
    historyNote: basicInfo.orgInfo.etymology,
    editorialNotes: basicInfo.orgInfo.editorialNote.map((e) => e.value),
    conceptClass: basicInfo.otherInfo.conceptClass,
    recommendedTerms: mapTerms(data.terms, 'recommended-term'),
    synonyms: mapTerms(data.terms, 'synonym'),
    notRecommendedTerms: mapTerms(data.terms, 'not-recommended-synonym'),
    searchTerms: mapTerms(data.terms, 'search-term'),
    broader: relations.broaderConcept.map((r) => r.id),
    narrower: relations.narrowerConcept.map((r) => r.id),
    related: relations.relatedConcept.map((r) => r.id),
    isPartOf: relations.isPartOfConcept.map((r) => r.id),
    hasPart: relations.hasPartConcept.map((r) => r.id),
    broadMatch: relations.broadInOther.map((r) => r.id),
    narrowMatch: relations.narrowInOther.map((r) => r.id),
    exactMatch: relations.matchInOther.map((r) => r.id),
    closeMatch: relations.closeMatch.map((r) => r.id),
    relatedMatch: relations.relatedConceptInOther.map((r) => r.id),
  } as Concept;
}

function mapTerms(terms: ConceptTermType[], type: string) {
  return terms
    .filter((term) => term.termType === type)
    .map(
      (term) =>
        ({
          language: term.language,
          label: term.prefLabel,
          homographNumber: +term.termHomographNumber,
          status: term.status,
          termInfo: term.termInfo,
          scope: term.scope,
          historyNote: term.historyNote,
          changeNote: term.changeNote,
          termStyle: term.termStyle,
          termFamily: term.termFamily !== '' ? term.termFamily : undefined,
          termConjugation:
            term.termConjugation !== '' ? term.termConjugation : undefined,
          termEquivalency:
            term.termEquivalency !== '' ? term.termEquivalency : undefined,
          wordClass: term.wordClass !== '' ? term.wordClass : undefined,
          sources: term.source.map((s) => s.value),
          editorialNotes: term.editorialNote.map((e) => e.value),
        } as Term)
    );
}
