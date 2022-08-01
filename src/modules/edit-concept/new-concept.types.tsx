import { Concepts } from '@app/common/interfaces/concepts.interface';

export interface ConceptTermType {
  changeNote: string;
  draftComment: string;
  editorialNote: ListType[];
  historyNote: string;
  id: string;
  language: string;
  prefLabel: string;
  scope: string;
  source: string;
  status: string;
  termConjugation: string;
  termEquivalency: string;
  termEquivalencyRelation: string;
  termFamily: string;
  termHomographNumber: string;
  termInfo: string;
  termStyle: string;
  termType: string;
  wordClass: string;
}

export interface BasicInfo {
  definition: {
    [key: string]: string;
  };
  example: ListType[];
  subject: string;
  note: ListType[];
  diagramAndSource: {
    diagram: DiagramType[];
    sources: string;
  };
  orgInfo: {
    changeHistory: string;
    editorialNote: ListType[];
    etymology: string;
  };
  otherInfo: {
    conceptClass: string;
    wordClass: string;
  };
  relationalInfo: {
    broaderConcept: Concepts[];
    narrowerConcept: Concepts[];
    relatedConcept: Concepts[];
    isPartOfConcept: Concepts[];
    hasPartConcept: Concepts[];
    relatedConceptInOther: Concepts[];
    matchInOther: Concepts[];
  };
}

export interface ListType {
  id: string;
  lang?: string;
  value: string;
}

export interface DiagramType {
  description: string;
  diagramName: string;
  diagramUrl: string;
}

export interface EditConceptType {
  terms: ConceptTermType[];
  basicInformation: BasicInfo;
}
