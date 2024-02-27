import { Status } from './status.interface';
import { Type } from './type.interface';

export interface DataModel {
  comment: {
    [key: string]: string;
  };
  contentModified: string;
  contributor: string[];
  created: string;
  documentation: {
    [key: string]: string;
  };
  id: string;
  isPartOf: string[];
  label: {
    [key: string]: string;
  };
  language: string[];
  modified: string;
  prefix: string;
  status: Status;
  type: Type;
  version?: string;
  versionIri?: string;
  uri: string;
  matchingResources: {
    id: string;
    uri: string;
    label: {
      [key: string]: string;
    };
    resourceType: string;
    highlights: {
      [key: string]: string[];
    };
    curie: string;
    [key: string]: unknown;
  }[];
}
