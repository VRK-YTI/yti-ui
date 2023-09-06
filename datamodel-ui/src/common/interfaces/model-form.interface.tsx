import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import {
  ModelType,
  ModelTerminology,
  ModelCodeList,
  ExternalNamespace,
  InternalNamespace,
} from './model.interface';
import { Status } from './status.interface';

export interface ModelFormType {
  contact: string;
  externalNamespaces: ExternalNamespace[];
  internalNamespaces: InternalNamespace[];
  languages: (LanguageBlockType & { selected: boolean })[];
  links: {
    description: string;
    name: string;
    uri: string;
    id: string;
  }[];
  organizations: MultiSelectData[];
  prefix: string;
  serviceCategories: MultiSelectData[];
  status?: Status;
  type: ModelType['type'];
  terminologies: ModelTerminology[];
  codeLists: ModelCodeList[];
  documentation?: { [key: string]: string };
}
