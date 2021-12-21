import { BaseEntity, Property } from './termed-data-types.interface';

export interface Group extends BaseEntity<'Group'> {
  properties: {
    definition?: Property[];
    notation?: Property[];
    order?: Property[];
    prefLabel?: Property[];
  };
};
