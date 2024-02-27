import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';
import { Type } from './type.interface';

export interface InternalClass {
  created: string;
  id: string;
  curie: string;
  identifier: string;
  isDefinedBy: string;
  label: {
    [key: string]: string;
  };
  language?: string[];
  modified: string;
  namespace: string;
  note: {
    [key: string]: string;
  };
  resourceType: ResourceType;
  status: Status;
}

export interface InternalClassInfo extends InternalClass {
  dataModelInfo: {
    label: {
      [key: string]: string;
    };
    groups: string[];
    status: Status;
    modelType: Type;
    uri: string;
    version?: string;
  };
  conceptInfo: {
    conceptURI: string;
    conceptLabel: {
      [key: string]: string;
    };
    terminologyLabel: {
      [key: string]: string;
    };
  };
}
