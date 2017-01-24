import { Node, Attribute } from './node';
import { Identifier } from './identifier';

export interface ConceptCollection extends Node<'Collection'> {

  properties: {
    prefLabel: Attribute[];
  };

  references: {
    member: Identifier<'Concept'>[]
  }
}
