import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import { ModelType, ModelTerminology, ModelCodeList } from './model.interface';
import { Status } from './status.interface';

export interface ModelFormType {
  contact: string;
  externalNamespaces: {
    name: string;
    namespace: string;
    prefix: string;
  }[];
  internalNamespaces: string[];
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations: MultiSelectData[];
  prefix: string;
  serviceCategories: MultiSelectData[];
  status?: Status;
  type: ModelType['type'];
  terminologies: ModelTerminology[];
  codeLists: ModelCodeList[];
  documentation?: { [key: string]: string };
}
