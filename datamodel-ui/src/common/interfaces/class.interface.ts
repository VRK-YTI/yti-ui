import { Status } from './status.interface';

export interface ClassType {
  label: { [key: string]: string };
  editorialNote?: string;
  status: Status;
  equivalentClass: string[];
  subClassOf: string[];
  subject: string;
  identifier: string;
  note: { [key: string]: string };
}

export const initialClass: ClassType = {
  label: {},
  editorialNote: '',
  status: 'DRAFT',
  equivalentClass: [],
  subClassOf: [],
  subject: '',
  identifier: '',
  note: {},
};
