import { Status } from './status.interface';

export interface CountsType {
  groups: {
    [key: string]: number;
  };
  languages: {
    fi: number;
    sv: number;
    en: number;
  };
  statuses: {
    [key in Status]: number;
  };
  types: {
    PROFILE: number;
    LIBRARY: number;
  };
}
