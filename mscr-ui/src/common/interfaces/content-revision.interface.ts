import { State } from '@app/common/interfaces/state.interface';

export interface ContentRevision {
  pid: string;
  label: {
    [key: string]: string;
  };
  versionLabel: string;
  state?: State;
  created?: string;
}
