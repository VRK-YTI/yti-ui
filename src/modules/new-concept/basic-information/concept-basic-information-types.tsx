import { Concepts } from '@app/common/interfaces/concepts.interface';

export interface BasicInfoUpdate {
  key: string;
  lang?: string;
  value: string | object;
}

export interface BasicInfo {
  id: string;
  lang?: string;
  value: string;
}

export interface DiagramType {
  description: string;
  diagramName: string;
  diagramUrl: string;
}

export interface BasicInfoType {
  definition: {
    [key: string]: string;
  };
  example: BasicInfo[];
  subject: string;
  note: BasicInfo[];
  diagramAndSource: {
    diagram: DiagramType[];
    sources: string;
  };
  orgInfo: {
    changeHistory: string;
    editorialNote: BasicInfo[];
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
