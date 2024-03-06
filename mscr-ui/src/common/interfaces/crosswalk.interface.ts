import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import { State } from '@app/common/interfaces/state.interface';
import { ContentRevision } from '@app/common/interfaces/content-revision.interface';
import { Metadata } from '@app/common/interfaces/metadata.interface';
import { Format } from '@app/common/interfaces/format.interface';
import { Visibility } from '@app/common/interfaces/search.interface';

export interface Crosswalk extends Metadata {
  status?: string | undefined;
  languages?: string[];
  organizations?: string[];
  sourceSchema: string;
  targetSchema: string;
}

export interface CrosswalkWithVersionInfo extends Crosswalk {
  revisions: ContentRevision[];
}

export interface CrosswalkFormType {
  pid?: string;
  format: Format;
  label: string;
  state: State;
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations?: MultiSelectData[];
  sourceSchema: string;
  targetSchema: string;
  description?: string;
  versionLabel?: string;
  visibility: Visibility;
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

export interface FilesRow {
  name: any;
  added: any;
  format: any;
  file: any;
}
