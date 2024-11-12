import { Status } from './status.interface';

export interface Terminology {
  id: string;
  prefix: string;
  languages?: string[];
  groups: string[];
  organizations: string[];
  status: Status;
  description?: {
    [key: string]: string;
  };
  uri: string;
  type: string;
  created: string;
  label: {
    [key: string]: string;
  };
}
