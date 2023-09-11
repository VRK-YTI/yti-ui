import { Status } from './status.interface';

export interface CountsType {
  groups: {
    [key: string]: number;
  };
  languages: {
    [key: string]: number;
  };
  statuses: {
    [key in Status]: number;
  };
  types: {
    PROFILE: number;
    LIBRARY: number;
  };
}
