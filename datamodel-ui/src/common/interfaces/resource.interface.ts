import { ConceptType } from './concept-interface';
import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';

export interface Resource {
  type: ResourceType;
  label: { [key: string]: string };
  editorialNote?: string;
  status: Status;
  subResourceOf: string[];
  equivalentResource: string[];
  subject?: ConceptType;
  identifier: string;
  note: { [key: string]: string };
  modified: string;
  created: string;
  contact?: string;
  contributor?: [
    {
      id: string;
      label: { [key: string]: string };
      parentOrganization: string;
    }
  ];
  uri: string;
}
