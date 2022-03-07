import { Group } from "./group.interface";
import { Organization } from "./organization.interface";
import { BaseEntity, Property } from "./termed-data-types.interface";

export interface VocabularyInfoDTO
  extends BaseEntity<"TerminologicalVocabulary"> {
  properties: {
    contact?: Property[];
    description?: Property[];
    language?: Property[];
    prefLabel?: Property[];
    priority?: Property[];
    status?: Property[];
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
