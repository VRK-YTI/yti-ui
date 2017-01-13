import { Localization } from './localization';

export interface ConceptScheme {
  createdBy: string;
  createdDate: string;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  uri: string;
  properties: {
    prefLabel: Localization[];
  };
  references: any[];
  referrers: {
    inScheme: { id: string, type: { graph: { id: string }, id: 'Concept' } }[];
  };
  type: { graph: { id: string }, id: 'ConceptScheme' }
}
