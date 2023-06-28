import { LanguageBlockType } from 'yti-common-ui/form/language-selector';

export interface NewTerminologyInfo {
  contact: string;
  languages: LanguageBlockType[];
  infoDomains: {
    groupId: string;
    labelText: string;
    name: string;
    uniqueItemId: string;
  }[];
  contributors: {
    labelText: string;
    name: string;
    organizationId: string;
    uniqueItemId: string;
  }[];
  prefix: [string, boolean];
  status?: string;
  type: string;
}
