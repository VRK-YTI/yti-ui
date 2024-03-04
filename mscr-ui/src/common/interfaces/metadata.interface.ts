import { Format } from '@app/common/interfaces/format.interface';
import { Visibility } from '@app/common/interfaces/search.interface';
import { State } from '@app/common/interfaces/state.interface';

export interface Metadata {
  pid: string;
  label: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  format: Format;
  visibility: Visibility;
  state: State;
  created: string;
  modified: string;
  versionLabel: string;
  contact: string;
  sourceSchema?: string;
  targetSchema?: string;
  namespace?: string;
  prefix?: string;
}

export interface MetadataFormType {
  label: string;
  description: string;
  contact: string;
  versionLabel: string;
  visibility: string;
}

export const initialMetadataForm: MetadataFormType = {
  label: '',
  description: '',
  contact: '',
  versionLabel: '',
  visibility: '',
};
