import { BaseEntity, Property } from './termed-data-types.interface';

export interface ConceptLink extends BaseEntity<'ConceptLink'> {
  properties: {
    prefLabel?: Property[];
    targetGraph?: Property[];
    targetId?: Property[];
    vocabularyLabel?: Property[];
  };
}
