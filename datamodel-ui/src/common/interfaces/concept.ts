import { Status } from './status.interface';

export interface Concept {
  definition: {
    [key: string]: string;
  };
  id: string;
  label: {
    [key: string]: string;
  };
  modified: string;
  status: Status;
  namespace: string;
  terminology: {
    id: string;
    prefix: string;
    label: {
      [key: string]: string;
    };
    status: string;
    uri: string;
  };
  uri: string;
}
