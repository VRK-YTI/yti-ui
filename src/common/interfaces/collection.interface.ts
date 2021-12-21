import { Concept } from './concept.interface';
import { BaseEntity, Property } from './termed-data-types.interface';

export interface Collection extends BaseEntity<'Collection'> {
  properties: {
    definition?: Property[];
    prefLabel?: Property[];
  };

  references: {
    member?: Concept[];
    broader?: Concept[];
  };
};
