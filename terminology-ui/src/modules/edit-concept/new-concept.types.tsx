export interface ConceptTermType {
  changeNote: string;
  draftComment: string;
  editorialNote: ListType[];
  historyNote: string;
  id: string;
  language: string;
  prefLabel: string;
  scope: string;
  source: ListType[];
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
  status: string;
  subject: string;
  note: ListType[];
  diagramAndSource: {
    diagrams: DiagramType[];
    sources: ListType[];
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
    broaderConcept: RelationInfoType[];
    narrowerConcept: RelationInfoType[];
    relatedConcept: RelationInfoType[];
    isPartOfConcept: RelationInfoType[];
    hasPartConcept: RelationInfoType[];
    relatedConceptInOther: RelationInfoType[];
    matchInOther: RelationInfoType[];
    closeMatch: RelationInfoType[];
  };
}

export interface RelationInfoType {
  id: string;
  label: { [key: string]: string };
  terminologyId: string;
  terminologyLabel: { [key: string]: string };
  targetId?: string;
}

export interface ListType {
  id: string;
  lang?: string;
  value: string;
}

export interface DiagramType {
  description: string;
  name: string;
  url: string;
  id: string;
}

export interface EditConceptType {
  terms: ConceptTermType[];
  basicInformation: BasicInfo;
}
