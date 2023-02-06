import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import { Status } from './status.interface';

export interface ModelFormType {
  contact: string;
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations: MultiSelectData[];
  prefix: string;
  serviceCategories: MultiSelectData[];
  status?: Status;
  type: 'profile' | 'library';
}