import { Status } from './status.interface';

export interface ClassType {
  label: { [key: string]: string };
  editorialNote?: string;
  status: Status;
  equivalentClass: string[];
  subClassOf: string[];
  subject: string;
  identifier: string;
  created: string;
  modified: string;
  contributor: [
    {
      id: string;
      label: { [key: string]: string };
      parentOrganization: string;
    }
  ];
  contact?: string;
  note: { [key: string]: string };
  uri: string;
}
