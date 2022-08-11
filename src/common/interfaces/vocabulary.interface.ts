import { Group } from './group.interface';
import { Organization } from './organization.interface';
import { BaseEntity, Property, Type } from './termed-data-types.interface';
import { GroupSearchResult } from './terminology.interface';

export interface VocabularyInfoDTO
  extends BaseEntity<'TerminologicalVocabulary'> {
  properties: {
    contact?: Property[];
    description?: Property[];
    language?: Property[];
    prefLabel?: Property[];
    priority?: Property[];
    status?: Property[];
    terminologyType?: Property[];
  };

  references: {
    contributor?: Organization[];
    inGroup?: Group[];
  };
}

export interface VocabularyConcepts {
  concepts: VocabularyConceptDTO[];
  resultStart: number;
  totalHitCount: number;
}

export interface VocabularyConceptDTO {
  broader?: string[];
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

export interface VocabulariesDTO {
  code: string;
  id: string;
  properties: {
    contact: Property[];
    language: Property[];
    prefLabel: Property[];
    status: Property[];
    terminologyType: Property[];
  };
  references: {
    contributor: {
      code: string;
      id: string;
      properties: {
        prefLabel: Property[];
      };
      references: {};
      type: Type<string>;
      uri: string;
    };
    inGroup: GroupSearchResult[];
  };
  type: Type<string>;
  uri: string;
}
