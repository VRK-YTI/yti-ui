import { BaseEntity, Property } from './termed-data-types.interface';

export interface Term extends BaseEntity<'Term'> {
  properties: {
    changeNote?: Property[];
    draftComment?: Property[];
    editorialNote?: Property[];
    historyNote?: Property[];
    prefLabel?: Property[];
    scope?: Property[];
    source?: Property[];
    status?: Property[];
    termConjugation?: Property[];
    termEquivalency?: Property[];
    termFamily?: Property[];
    termHomographNumber?: Property[];
    termInfo?: Property[];
    termStyle?: Property[];
    wordClass?: Property[];
  };
};
