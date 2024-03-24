import { State } from '@app/common/interfaces/state.interface';
import { Format } from '@app/common/interfaces/format.interface';
import { LanguageBlockType } from 'yti-common-ui/components/form/language-selector';
import { ContentRevision } from '@app/common/interfaces/content-revision.interface';
import { Metadata } from '@app/common/interfaces/metadata.interface';

export interface Schema extends Metadata {
  status?: string;
  languages?: string[];
  organizations: Organization[];
}

export interface SchemaWithContent {
  metadata: Metadata;
  content: {
    tree: unknown;
    definitions: unknown;
  };
}

export interface SchemaWithVersionInfo extends Schema {
  revisions: ContentRevision[];
}

export interface Organization {
  id: string;
  parentOrganization?: string;
  label: { [key: string]: string };
}

// ToDo: Proper typing
export interface SchemaFormType {
  namespace?: string;
  pid?: string;
  format: Format;
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations: Organization[];
  filedata?: any;
  state: State;
}

export interface FilesRowInput {
  filename: string;
  fileID: string;
  contentType: string;
  size: string;
}
