import { Status } from './status.interface';

export interface Terminology {
  id: string;
  code: string;
  languages?: string[];
  informationDomain: [
    {
      id: string;
      label: {
        [key: string]: string;
      };
    }
  ];
  contributors?: [
    {
      id: string;
      label: {
        [key: string]: string;
      };
    }
  ];
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
