import { ResourceType } from './resource-type.interface';
import { Status } from './status.interface';

export interface AttributeFormType {
  label: { [key: string]: string };
  editorialNote?: string;
  concept:
    | {
        label: { [key: string]: string };
        identifier: string;
      }
    | {};
  status: Status;
  equivalentResource: {
    label: { [key: string]: string };
    identifier: string;
  }[];
  subResourceOf: string[];
  subject: string;
  identifier: string;
  note: { [key: string]: string };
  type: ResourceType;
}

export const initialAttribute: AttributeFormType = {
  label: {},
  editorialNote: '',
  concept: {},
  status: 'DRAFT',
  equivalentResource: [],
  subResourceOf: [],
  subject: '',
  identifier: '',
  note: {},
  type: ResourceType.ATTRIBUTE,
};
