import { Status } from './status.interface';

export interface ConceptType {
  label: { [key: string]: string };
  definition: { [key: string]: string };
  conceptURI: string;
  status: Status;
  terminology: {
    label: { [key: string]: string };
    uri: string;
  };
}
