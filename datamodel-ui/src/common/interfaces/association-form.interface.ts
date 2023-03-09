import { Status } from './status.interface';

export interface AssociationFormType {
  label: { [key: string]: string };
  editorialNote?: string;
  status: Status;
  equivalentAssociations: string[];
  upperAssociations: string[];
  subject: object;
  identifier: string;
  note: { [key: string]: string };
}

export const initialAssociation: AssociationFormType = {
  label: {},
  editorialNote: '',
  status: 'DRAFT',
  equivalentAssociations: [],
  upperAssociations: [],
  subject: {},
  identifier: '',
  note: {},
};
