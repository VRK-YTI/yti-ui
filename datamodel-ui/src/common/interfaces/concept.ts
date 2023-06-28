import { Status } from './status.interface';

export interface Concept {
  broader?: string[];
  definition: {
    [key: string]: string;
  };
  id: string;
  label: {
    [key: string]: string;
  };
  modified: string;
  status: Status;
  terminology: {
    id: string;
    label: {
      [key: string]: string;
    };
    status: string;
    uri: string;
  };
  uri: string;
}
