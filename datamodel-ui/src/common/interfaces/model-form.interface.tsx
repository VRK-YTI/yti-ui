import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/form/language-selector';
import {
  ModelType,
  ModelTerminology,
  ModelCodeList,
  ExternalNamespace,
  InternalNamespace,
  Link,
} from './model.interface';
import { Status } from './status.interface';

export interface ModelFormType {
  contact: string;
  externalNamespaces: ExternalNamespace[];
  internalNamespaces: InternalNamespace[];
  languages: (LanguageBlockType & { selected: boolean })[];
  links: Link[];
  organizations: MultiSelectData[];
  prefix: string;
  serviceCategories: MultiSelectData[];
  status: Status;
  type: ModelType['graphType'];
  terminologies: ModelTerminology[];
  codeLists: ModelCodeList[];
  documentation?: { [key: string]: string };
}
