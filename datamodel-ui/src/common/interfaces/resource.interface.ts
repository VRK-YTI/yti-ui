import { ConceptType } from './concept-interface';
import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';

export interface Resource {
  allowedValues?: string[];
  classType?: string;
  contact?: string;
  contributor?: [
    {
      id: string;
      label: { [key: string]: string };
      parentOrganization: string;
    }
  ];
  created: string;
  creator: {
    id: string;
    name: string;
  };
  dataType?: string;
  dataTypeProperty?: string;
  defaultValue?: string;
  domain?: string;
  editorialNote?: string;
  equivalentResource: string[];
  hasValue?: string;
  identifier: string;
  label: { [key: string]: string };
  maxCount?: number;
  maxLength?: number;
  minCount?: number;
  minLength?: number;
  modified: string;
  modifier: {
    id: string;
    name: string;
  };
  note: { [key: string]: string };
  path?: string;
  range?: string;
  status: Status;
  subject?: ConceptType;
  subResourceOf: string[];
  type: ResourceType;
  uri: string;
  curie: string;
}
