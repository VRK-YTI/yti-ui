import { ConceptType } from './concept-interface';
import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';

export interface Resource {
  allowedValues?: any[];
  classType: any;
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
  dataType?: any;
  defaultValue?: any;
  domain?: string;
  editorialNote?: string;
  equivalentResource: string[];
  hasValue?: any;
  identifier: string;
  label: { [key: string]: string };
  maxCount?: any;
  maxLength?: any;
  minCount?: any;
  minLength?: any;
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
}
