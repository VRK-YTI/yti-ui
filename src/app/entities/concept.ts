import { Node, Attribute } from './node';
import { Identifier } from './identifier';

export interface Concept extends Node<'Concept'> {

  properties: {
    definition: Attribute[];
    term_status: Attribute[];
  };

  references: {
    inScheme: Identifier<'ConceptScheme'>[],
    prefLabelXl: Identifier<'Term'>[],
    related: Identifier<'Concept'>[]
  };

  referrers: {
    hasTopConcept: Identifier<'Concept'>[],
    member: Identifier<'Collection'>[],
    related: Identifier<'Concept'>[]
  };
}
