import { MultiSelectData } from 'suomifi-ui-components';
import { LanguageBlockType } from 'yti-common-ui/components/form/language-selector';
import { ModelType, ModelTerminology } from './model.interface';
import { Status } from './status.interface';

export interface Schema {
  id: string;
  format: string;
  status: string;
  label: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  languages: string;
  organiztaion: [string];
}

export interface SchemaFormType {
  contact: string;
  languages: (LanguageBlockType & { selected: boolean })[];
  organizations: MultiSelectData[];
  status?: Status;
}
