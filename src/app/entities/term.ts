import { Node, Attribute } from './node';
import { Identifier } from './identifier';

export interface Term extends Node<'Term'> {

  properties: {
    orderingNumber: Attribute[];
    prefLabel: Attribute[];
  }

  referrers: {
    prefLabelXl: Identifier<'Term'>[];
  }
}
