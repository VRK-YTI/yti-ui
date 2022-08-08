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
    broaderConcept: RelationInfoType[];
    narrowerConcept: RelationInfoType[];
    relatedConcept: RelationInfoType[];
    isPartOfConcept: RelationInfoType[];
    hasPartConcept: RelationInfoType[];
    relatedConceptInOther: RelationInfoType[];
    matchInOther: RelationInfoType[];
  };
}

export interface RelationInfoType {
  id: string;
  label: { [key: string]: string };
  terminologyId: string;
  terminologyLabel: { [key: string]: string };
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
