import { BaseEntity, Property } from './termed-data-types.interface';

export interface Organization extends BaseEntity<'Organization'> {
  properties: {
    prefLabel?: Property[];
  };
};
