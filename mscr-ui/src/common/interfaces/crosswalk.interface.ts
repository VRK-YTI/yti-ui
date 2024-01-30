import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import { State } from '@app/common/interfaces/state.interface';

//sample Crosswalk
export interface Crosswalk {
  pid?: string;
  format: string;
  status?: string | undefined;
  label: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  languages?: string[];
  organizations?: string[];
  sourceSchema: string;
  targetSchema: string;
  state?: State;
  namespace?: string;
  versionLabel?: string;
}

export interface CrosswalkFormType {
  pid?: string;
  format: string;
  label: string;
  state: State;
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations?: MultiSelectData[];
  sourceSchema: string;
  targetSchema: string;
  description?: string;
  versionLabel?: string;
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
