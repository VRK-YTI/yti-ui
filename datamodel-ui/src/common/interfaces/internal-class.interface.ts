import { Status } from './status.interface';

export interface InternalClass {
  created: string;
  id: string;
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
  status: Status;
}
