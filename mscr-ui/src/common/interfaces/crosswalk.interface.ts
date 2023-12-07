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
  namespace?: string;
  versionLabel?: string;
}

export interface CrosswalkFormType {
  pid?: string;
  format: string;
  label: string;
  state: string | undefined;
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations: MultiSelectData[];
  status?: Status;
  sourceSchema: string;
  targetSchema: string;
  description?: string;
}

export interface CreateCrosswalkMockupType {
  pid?: string;
  format: string;
  status: string | undefined;
  state: string | undefined;
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
  namespace?: string;
  versionLabel?: string;
}

export interface CrosswalkFormMockupType {
  pid?: string;
  format: string;
  status?: string | undefined;
  state: string | undefined;
  label: any;
  description?: any;
  languages: any;
  organizations: any;
  sourceSchema: string;
  targetSchema: string;
  namespace?: string;
  versionLabel?: string;
}
