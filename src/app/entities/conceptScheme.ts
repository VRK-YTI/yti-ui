import { Node, Attribute } from './node';
import { Identifier } from './identifier';

export interface ConceptScheme extends Node<'ConceptScheme'> {

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
