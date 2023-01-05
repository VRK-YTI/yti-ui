import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';

export interface ModelFormType {
  contact: string;
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations: MultiSelectData[];
  prefix: string;
  serviceCategories: MultiSelectData[];
  type: 'profile' | 'library';
}
