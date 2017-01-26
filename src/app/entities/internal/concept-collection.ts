import { NodeInternal } from './node';
import { Identifier } from '../identifier';
import { Attribute } from '../attribute';

export interface ConceptCollectionInternal extends NodeInternal<'Collection'> {

  properties: {
    prefLabel: Attribute[];
  };

  references: {
    member: Identifier<'Concept'>[]
  }
}
