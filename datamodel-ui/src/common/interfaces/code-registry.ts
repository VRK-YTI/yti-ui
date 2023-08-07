import { Status } from 'yti-common-ui/interfaces/status.interface';

export interface CodeRegistry {
  id: string;
  codeValue: string;
  uri: string;
  url: string;
  prefLabel: {
    [key: string]: string;
  };
  created: string;
  modified: string;
  codeSchemesUrl: string;
  organizations: {
    id: string;
  }[];
}

export interface CodeRegistryType {
  id: string;
  codeValue: string;
  uri: string;
  url: string;
  status: Status;
  order: number;
  hierarchyLevel: number;
  created: string;
  modified: string;
  statusModified: string;
  prefLabel: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  codeScheme: {
    uri: string;
    url: string;
  };
  membersUrl: string;
}
