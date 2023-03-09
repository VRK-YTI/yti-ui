import { Status } from './status.interface';

export interface AttributeFormType {
  label: { [key: string]: string };
  editorialNote?: string;
  status: Status;
  equivalentAttribute: string[];
  upperAttribute: string[];
  subject: object;
  identifier: string;
  note: { [key: string]: string };
}

export const initialAttribute: AttributeFormType = {
  label: {},
  editorialNote: '',
  status: 'DRAFT',
  equivalentAttribute: [],
  upperAttribute: [],
  subject: {},
  identifier: '',
  note: {},
};
