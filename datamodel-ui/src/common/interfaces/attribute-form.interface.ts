import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';

export interface AttributeFormType {
  label: { [key: string]: string };
  editorialNote?: string;
  status: Status;
  equivalentResource: string[];
  subResourceOf: string[];
  subject: string;
  identifier: string;
  note: { [key: string]: string };
  type: ResourceType;
  domain?: {
    id: string;
    label: string;
  };
  range?: {
    id: string;
    label: string;
  };
}

export const initialAttribute: AttributeFormType = {
  label: {},
  editorialNote: '',
  status: 'DRAFT',
  equivalentResource: [],
  subResourceOf: [],
  subject: '',
  identifier: '',
  note: {},
  type: ResourceType.ATTRIBUTE,
  domain: undefined,
  range: undefined,
};
