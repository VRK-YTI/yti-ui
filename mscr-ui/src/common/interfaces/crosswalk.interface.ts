import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import { Status } from './status.interface';

//sample Crosswalk
export interface Crosswalk {
  pid?: string;
  format: string;
  status: string | undefined;
  label: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  languages: string[];
  organizations: string[];
  sourceSchema: string;
  targetSchema: string;
  state: string | undefined;
}

export interface CrosswalkFormType {
  pid?: string;
  format: string;
  label: string;
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations: MultiSelectData[];
  status?: Status;
  sourceSchema: string;
  targetSchema: string;
  description?: string;
}

export interface CrosswalkFormMockupType {
  sourceSchema: string;
  targetSchema: string;
  name: string;
  description: string;
}

export interface CreateCrosswalkMockupType {
  sourceSchema: string;
  targetSchema: string;
  name: string;
  description: string;
}
