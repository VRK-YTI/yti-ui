import { NodeInternal } from './node';
import { Identifier } from '../identifier';
import { Attribute } from '../attribute';

export interface ConceptSchemeInternal extends NodeInternal<'ConceptScheme'> {

  properties: {
    prefLabel: Attribute[];
  };

  references: {
    hasTopConcept: Identifier<'Concept'>[]
  }

  referrers: {
    inScheme: Identifier<'Concept'>[]
  };
}
