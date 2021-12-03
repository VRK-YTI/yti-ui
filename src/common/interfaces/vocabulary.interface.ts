// TODO: Typing could be done better without this much retyping

export interface VocabularyInfoDTO {
  code: string;
  createdBy: string;
  createdDate: string;
  id: string;
  identifier: VocabularyIdentifier;
  lastModifiedBy: string;
  lastModifiedDate: string;
  number: number;
  properties: {
    description: VocabularyProperties[];
    language: VocabularyProperties[];
    prefLabel: VocabularyProperties[];
    priority: VocabularyProperties[];
    status: VocabularyProperties[];
  };
  references: {
    contributor: [
      {
        code: string;
        createdBy: string;
        createdDate: string;
        id: string;
        identifier: VocabularyIdentifier;
        lastModifiedBy: string;
        lastModifiedDate: string;
        number: number;
        properties: {
          prefLabel: VocabularyProperties[];
        };
        references: {};
        referrers: {};
        type: VocabularyType;
        uri: string;
      }
    ];
    inGroup: [
      {
        code: string;
        createdBy: string;
        createdDate: string;
        id: string;
        identifier: VocabularyIdentifier;
        lastModifiedBy: string;
        lastModifiedDate: string;
        number: number;
        properties: {
          definition: VocabularyProperties[];
          notation: VocabularyProperties[];
          order: VocabularyProperties[];
          prefLabel: VocabularyProperties[];
        };
        references: {};
        referrers: {};
        type: VocabularyType;
        uri: string;
      }
    ];
  };
  referrers: {};
  type: VocabularyType;
  uri: string;
};

export interface VocabularyConceptsDTO {
  definition: {
    [key: string]: string;
  };
  id: string;
  label: {
    [key: string]: string;
  };
  modified: string;
  status: string;
  terminology: {
    id: string;
    label: {
      [key: string]: string;
    };
    status: string;
    uri: string;
  };
  uri: string;
}

export interface VocabularyProperties {
  lang: string;
  regex: string;
  value: string;
}

export interface VocabularyIdentifier {
  id: string;
  type: VocabularyType;
}

export interface VocabularyType {
  graph: {
    id: string;
  };
  id: string;
  uri: string;
}
